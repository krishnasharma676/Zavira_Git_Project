import { prisma } from "../config/prisma";
import { MessageStatus } from "@prisma/client";

export class ContactRepository {
  async create(data: { name: string; email: string; subject: string; message: string }) {
    return await prisma.contactMessage.create({
      data,
    });
  }

  async findAll() {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return await prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: MessageStatus, reply?: string) {
    return await prisma.contactMessage.update({
      where: { id },
      data: { status, reply },
    });
  }

  async delete(id: string) {
    return await prisma.contactMessage.delete({
      where: { id },
    });
  }
}

export const contactRepository = new ContactRepository();
