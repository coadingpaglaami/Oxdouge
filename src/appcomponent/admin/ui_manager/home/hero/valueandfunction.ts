export const MAX_NEW_IMAGES = 5;
const CLOUDINARY_BASE = 'https://res.cloudinary.com/YOUR_CLOUD_NAME/'; // ← replace with your cloud name
export const resolveImage = (path: string) =>
  path.startsWith('http') ? path : `${CLOUDINARY_BASE}${path}`;