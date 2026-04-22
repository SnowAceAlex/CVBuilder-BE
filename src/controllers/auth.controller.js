import User from '../models/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/token.util.js';
import { deleteAvatar as deleteFromCloudinary } from '../services/cloudinary.service.js';
import { formatUserProfile } from '../utils/user.util.js';
import jwt from 'jsonwebtoken';

const ALLOWED_GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const parseOptionalDate = (value, fieldName) => {
  if (value === null || value === undefined || value === '') return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const err = new Error(`Invalid date for field "${fieldName}"`);
    err.status = 400;
    throw err;
  }
  return date;
};

const buildExperienceItem = (item, { partial = false, prefix = 'experience' } = {}) => {
  if (!item || typeof item !== 'object') {
    const err = new Error(`${prefix} body must be an object`);
    err.status = 400;
    throw err;
  }

  const result = {};

  if (item.companyName !== undefined) {
    const companyName = String(item.companyName || '').trim();
    if (!companyName) {
      const err = new Error(`${prefix}.companyName cannot be empty`);
      err.status = 400;
      throw err;
    }
    result.companyName = companyName;
  } else if (!partial) {
    const err = new Error(`${prefix}.companyName is required`);
    err.status = 400;
    throw err;
  }

  if (item.position !== undefined) {
    const position = String(item.position || '').trim();
    if (!position) {
      const err = new Error(`${prefix}.position cannot be empty`);
      err.status = 400;
      throw err;
    }
    result.position = position;
  } else if (!partial) {
    const err = new Error(`${prefix}.position is required`);
    err.status = 400;
    throw err;
  }

  if (item.startDate !== undefined) {
    result.startDate = parseOptionalDate(item.startDate, `${prefix}.startDate`);
  }
  if (item.endDate !== undefined) {
    result.endDate = parseOptionalDate(item.endDate, `${prefix}.endDate`);
  }

  return result;
};

const buildEducationItem = (item, { partial = false, prefix = 'education' } = {}) => {
  if (!item || typeof item !== 'object') {
    const err = new Error(`${prefix} body must be an object`);
    err.status = 400;
    throw err;
  }

  const result = {};

  if (item.schoolName !== undefined) {
    const schoolName = String(item.schoolName || '').trim();
    if (!schoolName) {
      const err = new Error(`${prefix}.schoolName cannot be empty`);
      err.status = 400;
      throw err;
    }
    result.schoolName = schoolName;
  } else if (!partial) {
    const err = new Error(`${prefix}.schoolName is required`);
    err.status = 400;
    throw err;
  }

  if (item.major !== undefined) {
    const major = String(item.major || '').trim();
    result.major = major || undefined;
  }

  if (item.startDate !== undefined) {
    result.startDate = parseOptionalDate(item.startDate, `${prefix}.startDate`);
  }
  if (item.endDate !== undefined) {
    result.endDate = parseOptionalDate(item.endDate, `${prefix}.endDate`);
  }

  return result;
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'fullName is required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      fullName: fullName.trim(),
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, _next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, token failed' });
    }

    const accessToken = generateAccessToken(user._id);

    res.status(200).json({ success: true, accessToken });
  } catch {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, token failed' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, _next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch {
      // Ignore token verification errors on logout
    }
  }

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current authenticated user's profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: formatUserProfile(req.user) });
};

// @desc    Update current authenticated user's profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const {
      fullName,
      phone,
      address,
      jobTitle,
      summary,
      website,
      birthday,
      gender,
    } = req.body;

    if (fullName !== undefined) {
      const trimmed = typeof fullName === 'string' ? fullName.trim() : '';
      if (!trimmed) {
        return res
          .status(400)
          .json({ success: false, message: 'fullName cannot be empty' });
      }
      user.fullName = trimmed;
    }

    if (phone !== undefined)
      user.phone = phone === null || phone === '' ? undefined : String(phone).trim();
    if (address !== undefined)
      user.address =
        address === null || address === '' ? undefined : String(address).trim();
    if (jobTitle !== undefined)
      user.jobTitle =
        jobTitle === null || jobTitle === ''
          ? undefined
          : String(jobTitle).trim();
    if (summary !== undefined)
      user.summary =
        summary === null || summary === '' ? undefined : String(summary).trim();
    if (website !== undefined)
      user.website =
        website === null || website === '' ? undefined : String(website).trim();

    if (birthday !== undefined) {
      user.birthday = parseOptionalDate(birthday, 'birthday');
    }

    if (gender !== undefined) {
      if (gender === null || gender === '') {
        user.gender = null;
      } else if (!ALLOWED_GENDERS.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: `gender must be one of: ${ALLOWED_GENDERS.join(', ')}`,
        });
      } else {
        user.gender = gender;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserProfile(user),
    });
  } catch (error) {
    if (error.status === 400) {
      return res
        .status(400)
        .json({ success: false, message: error.message });
    }
    next(error);
  }
};

// ── Experience item handlers ──

// @desc    Add a new experience entry
// @route   POST /api/auth/profile/experiences
// @access  Private
export const addExperience = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const payload = buildExperienceItem(req.body, { prefix: 'experience' });
    user.experiences.push(payload);
    await user.save();

    const created = user.experiences[user.experiences.length - 1];
    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      experience: created,
      user: formatUserProfile(user),
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Update an experience entry by id
// @route   PUT /api/auth/profile/experiences/:id
// @access  Private
export const updateExperience = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const item = user.experiences.id(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Experience not found' });
    }

    const updates = buildExperienceItem(req.body, {
      partial: true,
      prefix: 'experience',
    });
    Object.assign(item, updates);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      experience: item,
      user: formatUserProfile(user),
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Delete an experience entry by id
// @route   DELETE /api/auth/profile/experiences/:id
// @access  Private
export const deleteExperience = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const item = user.experiences.id(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Experience not found' });
    }

    item.deleteOne();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
      user: formatUserProfile(user),
    });
  } catch (error) {
    next(error);
  }
};

// ── Education item handlers ──

// @desc    Add a new education entry
// @route   POST /api/auth/profile/educations
// @access  Private
export const addEducation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const payload = buildEducationItem(req.body, { prefix: 'education' });
    user.educations.push(payload);
    await user.save();

    const created = user.educations[user.educations.length - 1];
    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      education: created,
      user: formatUserProfile(user),
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Update an education entry by id
// @route   PUT /api/auth/profile/educations/:id
// @access  Private
export const updateEducation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const item = user.educations.id(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Education not found' });
    }

    const updates = buildEducationItem(req.body, {
      partial: true,
      prefix: 'education',
    });
    Object.assign(item, updates);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Education updated successfully',
      education: item,
      user: formatUserProfile(user),
    });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Delete an education entry by id
// @route   DELETE /api/auth/profile/educations/:id
// @access  Private
export const deleteEducation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const item = user.educations.id(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: 'Education not found' });
    }

    item.deleteOne();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Education deleted successfully',
      user: formatUserProfile(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Attach an already-uploaded avatar URL to the User profile
// @route   POST /api/auth/profile/avatar
// @access  Private
export const uploadProfileAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const { url, publicId } = req.body || {};

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'url is required' });
    }

    const previousPublicId = user.avatarPublicId;
    if (previousPublicId && previousPublicId !== publicId) {
      await deleteFromCloudinary(previousPublicId).catch(() => {});
    }

    user.avatarUrl = url.trim();
    user.avatarPublicId =
      typeof publicId === 'string' && publicId.trim() ? publicId.trim() : undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      user: formatUserProfile(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete avatar image
// @route   DELETE /api/auth/profile/avatar
// @access  Private
export const deleteProfileAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (!user.avatarPublicId) {
      return res
        .status(400)
        .json({ success: false, message: 'No avatar to delete' });
    }

    await deleteFromCloudinary(user.avatarPublicId);

    user.avatarUrl = undefined;
    user.avatarPublicId = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully',
      user: formatUserProfile(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both currentPassword and newPassword',
      });
    }

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    OAuth callback for GitHub
// @route   GET /api/auth/github/callback
// @access  Public (redirect from GitHub)
export const githubCallback = async (req, res, next) => {
  try {
    const user = req.user;

    const userId = user?._id ?? user?.id;

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(
      `${process.env.CLIENT_URL}/login-success?token=${accessToken}`,
    );
  } catch (error) {
    next(error);
  }
};

// @desc    OAuth callback for Google
// @route   GET /api/auth/google/callback
// @access  Public (redirect from Google)
export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_no_user`,
      );
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    return res.redirect(`${process.env.CLIENT_URL}/login-success`);
  } catch (error) {
    return next(error);
  }
};
