import { uploadAvatar as uploadToCloudinary } from '../services/cloudinary.service.js';

// @desc    Stateless avatar upload. Uploads the image to Cloudinary and
//          returns the hosted URL. Nothing is persisted to the database.
//          The frontend is responsible for using / storing the returned URL.
// @route   POST /api/upload/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No image file provided' });
    }

    const { url, publicId } = await uploadToCloudinary(
      req.file.buffer,
      req.user._id.toString(),
    );

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { url, publicId },
    });
  } catch (error) {
    next(error);
  }
};
