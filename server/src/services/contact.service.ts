import { contactRepository } from "../repositories/contact.internal";
import { ApiError } from "../utils/ApiError";
import { sendEmail } from "../utils/mail";

export class ContactService {
  async submitMessage(data: { name: string; email: string; subject: string; message: string }) {
    if (!data.name || !data.email || !data.subject || !data.message) {
      throw new ApiError(400, "All fields are required");
    }
    return await contactRepository.create(data);
  }

  async getAllMessages() {
    return await contactRepository.findAll();
  }

  async replyToMessage(id: string, reply: string) {
    if (!reply) throw new ApiError(400, "Reply content is required");

    const message = await contactRepository.findById(id);
    if (!message) throw new ApiError(404, "Message not found");

    // Send reply via email
    await sendEmail(
      message.email,
      `RE: ${message.subject}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #7A578D;">Dear ${message.name},</h2>
          <p>Thank you for reaching out to us. Regarding your inquiry on "${message.subject}", here is our response:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #7A578D;">
            ${reply}
          </div>
          <p>If you have any further questions, feel free to reply to this email or visit our website.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">Best Regards,<br/>Team Zavira</p>
        </div>
      `
    );

    return await contactRepository.updateStatus(id, "REPLIED", reply);
  }

  async deleteMessage(id: string) {
    return await contactRepository.delete(id);
  }

  async markAsRead(id: string) {
    const msg = await contactRepository.findById(id);
    if (msg?.status === "PENDING") {
      return await contactRepository.updateStatus(id, "READ");
    }
    return msg;
  }
}

export const contactService = new ContactService();
