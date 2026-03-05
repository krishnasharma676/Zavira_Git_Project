import { testimonialRepository } from "../repositories/testimonial.internal";
import { ApiError } from "../utils/ApiError";

export class TestimonialService {
  async createTestimonial(data: any) {
    return await testimonialRepository.create(data);
  }

  async getById(id: string) {
    return await testimonialRepository.findById(id);
  }

  async getAllAdmin() {
    return await testimonialRepository.findAllAdmin();
  }

  async getAllPublic() {
    return await testimonialRepository.findAllPublic();
  }

  async updateTestimonial(id: string, data: any) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new ApiError(404, "Testimonial not found");
    return await testimonialRepository.update(id, data);
  }

  async deleteTestimonial(id: string) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new ApiError(404, "Testimonial not found");
    return await testimonialRepository.delete(id);
  }
}

export const testimonialService = new TestimonialService();
