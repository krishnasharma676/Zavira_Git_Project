import axios from "axios";
import { ApiError } from "../utils/ApiError";

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
      sku: item.product.sku || item.productId,
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
      tax: 0,
    }));

    const payload = {
      order_id: order.orderNumber,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: "Primary", // Adjust based on common Shiprocket settings
      billing_customer_name: order.address.name.split(' ')[0],
      billing_last_name: order.address.name.split(' ')[1] || "",
      billing_address: order.address.street,
      billing_address_2: "",
      billing_city: order.address.city,
      billing_pincode: order.address.pincode,
      billing_state: order.address.state,
      billing_country: order.address.country,
      billing_email: order.user?.email || "customer@example.com",
      billing_phone: order.address.phone,
      shipping_is_billing: true,
      order_items: shiprocketItems,
      payment_method: order.paymentMethod === 'COD' ? 'Postpaid' : 'Prepaid',
      sub_total: order.totalAmount,
      length: 10, // Placeholder
      breadth: 10, // Placeholder
      height: 10, // Placeholder
      weight: 0.5, // Placeholder
    };

    try {
      const response = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { order_id, shipment_id } = response.data;
      return { order_id, shipment_id };
    } catch (error: any) {
      console.error("Shiprocket Order Create Error:", error.response?.data || error.message);
      return null;
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
      console.error("Shiprocket AWB Assignment Error:", error.response?.data || error.message);
      return null;
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
}

export const shiprocketService = new ShiprocketService();
