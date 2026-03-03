import cloudinary from '../config/cloudinary';
import { ApiError } from '../utils/ApiError';

export const uploadOnCloudinary = async (fileBuffer: Buffer, folder: string) => {
  try {
    if (!fileBuffer) return null;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `KrishJwels/${folder}`,
          resource_type: 'auto',
          format: 'webp', // Auto convert to webp as per rule
          quality: 'auto:good', // Auto compression
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary Upload Error:", JSON.stringify(error, null, 2));
            return reject(new ApiError(500, `Cloudinary Upload Failed: ${error.message}`));
          }
          resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    throw new ApiError(500, "Image upload pipeline failed");
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return null;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Failed:", error);
  }
};
