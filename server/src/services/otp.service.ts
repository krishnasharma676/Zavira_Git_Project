import { userRepository } from "../repositories/user.internal";
import { sendOtpEmail } from "../utils/mail";

export class OtpService {
  async sendOtp(phone: string) {
    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // In a real app, you would call an SMS provider here like Twilio or Msg91
    console.log(`[OTP] Sending ${code} to ${phone}`);

    await userRepository.createOTP({
      phone,
      code,
      expiresAt,
    });

    return { success: true, message: "OTP sent successfully" };
  }

  async sendEmailOtp(email: string) {
    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`[OTP] Sending ${code} to email ${email}`);

    await userRepository.createEmailOTP({
      email,
      code,
      expiresAt,
    });

    try {
      await sendOtpEmail(email, code);
    } catch (err) {
       console.error("Error sending OTP email:", err);
       // continue for now as it's correctly saved in DB
    }

    return { success: true, message: "OTP sent to your email" };
  }

  async verifyOtp(phoneOrEmail: string, code: string, type: "PHONE" | "EMAIL" = "PHONE") {
    const otp = await userRepository.findOTP(phoneOrEmail, code, type);
    if (!otp) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    // Delete OTP after verification
    await userRepository.deleteOTP(phoneOrEmail, type);

    return { success: true };
  }
}

export const otpService = new OtpService();
