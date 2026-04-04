import axios from "axios";
import { ApiError } from "../utils/ApiError";
import { settingService } from "./setting.service";

export class ShiprocketService {
  private static token: string | null = null;
  private static tokenExpiry: number | null = null;
  private static isTestMode = process.env.SHIPROCKET_TEST_MODE === "true";

  private static async authenticate() {
    if (this.isTestMode) return "test_token";
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      });

      this.token = response.data.token;
      // Tokens are valid for 24h, let's keep it for 23h
      this.tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
      return this.token;
    } catch (error: any) {
      console.error("Shiprocket Auth Error:", error.response?.data || error.message);
      throw new ApiError(500, "Shiprocket authentication failed");
    }
  }

  async createShipment(order: any) {
    if (ShiprocketService.isTestMode) {
      console.log("✔ [SHIPROCKET] Test Mode: Generating mock shipment");
      return { 
        order_id: `MOCK_ORD_${Date.now()}`, 
        shipment_id: `MOCK_SHIP_${Math.floor(Math.random() * 1000000)}` 
      };
    }

    const token = await ShiprocketService.authenticate();
    
    // Transform order items for Shiprocket
    const shiprocketItems = order.items.map((item: any) => ({
      name: item.product.name,
      sku: item.sku || item.product.sku || item.productId,
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
      tax: 0,
    }));

    // Calculate dynamic weight and dimensions
    let totalWeight = 0;
    let maxLength = 0;
    let maxBreadth = 0;
    let maxHeight = 0;

    for (const item of (order.items || [])) {
      const p = item.product || {};
      const qty = item.quantity || 1;
      
      // Weight (converted to kg if necessary, Shiprocket expects kg)
      let w = Number(p.weight) || 0.1; // fallback to 100g
      if (p.weightUnit?.toLowerCase() === 'g' || p.weightUnit?.toLowerCase() === 'grams') w = w / 1000;
      totalWeight += (w * qty);

      // Dimensions (Shiprocket expects cm)
      const l = Number(p.length) || 10;
      const b = Number(p.width)  || 10;
      const h = Number(p.height) || 10;

      // Simple heuristic: max length/breadth, and summed height for stacked items
      maxLength = Math.max(maxLength, l);
      maxBreadth = Math.max(maxBreadth, b);
      maxHeight += (h * qty);
    }

    // Constraints check (min values for Shiprocket)
    totalWeight = Math.max(totalWeight, 0.05); // min 50g
    maxLength = Math.max(maxLength, 1);
    maxBreadth = Math.max(maxBreadth, 1);
    maxHeight = Math.max(maxHeight, 1);

    // Fetch pickup location from admin settings (set this in Admin → Settings)
    const pickupLocation = await settingService.getSetting('shiprocket_pickup_location') || process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary';

    const address = order.address || {};
    const nameParts = address.name ? address.name.split(' ') : ['User'];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      order_id: order.shippingStatus === 'Ready for Reshipment' ? `${order.orderNumber}-RE` : order.orderNumber,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: pickupLocation,
      
      // Billing details (MUST be accurate)
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: address.street,
      billing_address_2: address.area || '',
      billing_city: address.city,
      billing_pincode: address.pincode,
      billing_state: address.state,
      billing_country: address.country || 'India',
      billing_email: order.user?.email || '',
      billing_phone: address.phone,
      
      shipping_is_billing: true,

      order_items: shiprocketItems,
      payment_method: order.paymentMethod === 'COD' ? 'Postpaid' : 'Prepaid',
      sub_total: order.totalAmount,
      length: maxLength,
      breadth: maxBreadth,
      height: maxHeight,
      weight: totalWeight,
    };

    // Fetch store GSTIN from settings and add if available
    const gstin = await settingService.getSetting('store_gstin');
    if (gstin) {
      (payload as any).billing_gstin = gstin;
    }

    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { order_id, shipment_id } = response.data;
      return { order_id, shipment_id };
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.response?.data || error.message;
      console.error("Shiprocket Order Create Error:", errMsg);
      throw new Error(`Shiprocket Error: ${typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)} \n\nPayload: ${JSON.stringify(payload)}`);
    }
  }

  async generateAWB(shipmentId: string) {
    if (ShiprocketService.isTestMode) {
      return {
        response: {
          data: {
            awb_code: `AWB_MOCK_${Math.floor(Math.random() * 1000000)}`,
            courier_name: "Test Courier (FedEx Mock)",
            tracking_url: "https://www.google.com/search?q=tracking_mock"
          }
        }
      };
    }
 
    const token = await ShiprocketService.authenticate();
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
        { shipment_id: shipmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.response?.data || error.message;
      console.error("Shiprocket AWB Assignment Error:", errMsg);
      throw new Error(`Shiprocket AWB Error: ${typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)}`);
    }
  }

  async cancelShipment(shipmentId: string) {
    if (ShiprocketService.isTestMode) {
      return { success: true, message: "Mock cancellation successful" };
    }

    const token = await ShiprocketService.authenticate();
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/cancel/shipment/external",
        { shipment_id: [shipmentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.response?.data || error.message;
      console.error("Shiprocket Shipment Cancel Error:", errMsg);
      throw new Error(`Shiprocket Cancel Error: ${typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)}`);
    }
  }

  async getTrackingDetails(shipmentId: string) {
    if (ShiprocketService.isTestMode) {
      return { status: "Shipped (Test Mode)", current_status: "In Transit" };
    }

    const token = await ShiprocketService.authenticate();
    try {
      const response = await axios.get(
        `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return null;
    }
  }

  async generateLabel(shipmentId: string) {
    if (ShiprocketService.isTestMode) {
      return { 
        label_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
      };
    }

    const token = await ShiprocketService.authenticate();
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/courier/generate/label",
        { shipment_id: [shipmentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return null;
    }
  }

  async generateManifest(shipmentId: string) {
    const token = await ShiprocketService.authenticate();
    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/manifests/generate",
        { shipment_id: [shipmentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return null;
    }
  }

  async createReverseShipment(order: any) {
    if (ShiprocketService.isTestMode) {
      console.log("✔ [SHIPROCKET] Test Mode: Generating mock REVERSE shipment");
      return { 
        order_id: `MOCK_REV_${Date.now()}`, 
        shipment_id: `MOCK_REV_SHIP_${Math.floor(Math.random() * 1000000)}` 
      };
    }

    const token = await ShiprocketService.authenticate();
    
    // Get store return address from settings
    const returnAddress = await settingService.getSetting('store_address') || "Zavira Store, Building 1, Main Street, Delhi - 110001";
    
    const payload = {
      order_id: `${order.orderNumber}-REV`,
      order_date: new Date().toISOString().split('T')[0],
      pickup_customer_name: order.address.name,
      pickup_last_name: "Customer",
      pickup_address: order.address.street,
      pickup_address_2: order.address.area,
      pickup_city: order.address.city,
      pickup_state: order.address.state,
      pickup_country: "India",
      pickup_pincode: order.address.pincode,
      pickup_email: order.user?.email || "customer@example.com",
      pickup_phone: order.address.phone,
      shipping_customer_name: "Zavira Repairs/Returns",
      shipping_address: returnAddress,
      shipping_city: "Delhi", // Should ideally be part of returnAddress setting
      shipping_state: "Delhi",
      shipping_country: "India",
      shipping_pincode: "110001",
      shipping_phone: "9876543210",
      order_items: order.items.map((i: any) => ({
        name: i.product.name,
        sku: i.sku || i.product.sku || i.productId,
        units: i.quantity,
        selling_price: 1, // Usually nominal for returns
        discount: 0,
        tax: 0,
      })),
      payment_method: "Prepaid",
      total_discount: 0,
      sub_total: 1,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/return",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error: any) {
      console.error("Shiprocket Reverse Order Error:", error.response?.data || error.message);
      return null;
    }
  }
}

export const shiprocketService = new ShiprocketService();
