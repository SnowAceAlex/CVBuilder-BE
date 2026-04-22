const NOT_PROVIDED = 'Not provided';

const isEmpty = (value) =>
  value === null || value === undefined || value === '';

const formatScalar = (value) => (isEmpty(value) ? NOT_PROVIDED : value);

const formatDate = (value) => {
  if (isEmpty(value)) return NOT_PROVIDED;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return NOT_PROVIDED;
  return date.toISOString();
};

const formatExperience = (item) => ({
  _id: item._id,
  companyName: formatScalar(item.companyName),
  position: formatScalar(item.position),
  startDate: formatDate(item.startDate),
  endDate: formatDate(item.endDate),
});

const formatEducation = (item) => ({
  _id: item._id,
  schoolName: formatScalar(item.schoolName),
  major: formatScalar(item.major),
  startDate: formatDate(item.startDate),
  endDate: formatDate(item.endDate),
});

export const formatUserProfile = (userDoc) => {
  if (!userDoc) return null;
  const user =
    typeof userDoc.toObject === 'function' ? userDoc.toObject() : userDoc;

  return {
    id: user._id,
    email: user.email,
    fullName: formatScalar(user.fullName),
    role: user.role,
    phone: formatScalar(user.phone),
    address: formatScalar(user.address),
    jobTitle: formatScalar(user.jobTitle),
    summary: formatScalar(user.summary),
    website: formatScalar(user.website),
    avatarUrl: formatScalar(user.avatarUrl),
    avatarPublicId: formatScalar(user.avatarPublicId),
    birthday: formatDate(user.birthday),
    gender: formatScalar(user.gender),
    experiences: Array.isArray(user.experiences)
      ? user.experiences.map(formatExperience)
      : [],
    educations: Array.isArray(user.educations)
      ? user.educations.map(formatEducation)
      : [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
