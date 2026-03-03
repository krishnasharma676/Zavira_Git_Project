import { userRepository } from "../repositories/user.internal";

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

  async verifyOtp(phone: string, code: string) {
    const otp = await userRepository.findOTP(phone, code);
    if (!otp) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    // Delete OTP after verification
    await userRepository.deleteOTP(phone);

    return { success: true };
  }
}

export const otpService = new OtpService();
