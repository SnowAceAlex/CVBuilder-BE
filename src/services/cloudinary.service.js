import cloudinary from '../config/cloudinary.js';

/**
 * Upload an avatar image buffer to Cloudinary.
 *
 * @param {Buffer} fileBuffer  – The raw image buffer from multer
 * @param {string} userId      – Used to namespace the upload folder
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export const uploadAvatar = (fileBuffer, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `cv-builder/avatars/${userId}`,
        transformation: [
          { width: 400, height: 400, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary by its public ID.
 *
 * @param {string} publicId – The Cloudinary public ID to destroy
 * @returns {Promise<object>}
 */
export const deleteAvatar = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
