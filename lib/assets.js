/**
 * Asset Configuration
 *
 * Centralized configuration for all media assets (videos, images).
 * Modify this file to change asset paths across the entire application.
 */

// Asset path configuration
export const ASSET_CONFIG = {
  // Base paths (modify these for different deployments)
  basePath: 'https://miguel-app.pages.dev',  // External URL for media assets

  // Video naming patterns
  videos: {
    idle: 'idle',
    intro: 'intro',
    introStatic: 'intro_static',
    objective: 'objective',
    skills: 'skills',
    certs: 'certs',
    applied: 'applied',
    projects: 'projects',
  },

  // Image paths
  images: {
    poster: 'poster',
    face: 'face',
    avatar: 'avatar',
    qr: 'qr',
    facebook: 'fb',
  },

  // Suffixes
  suffixes: {
    real: '_real',      // Photorealistic version
    german: '_de',      // German language
  },

  // File extensions
  extensions: {
    video: '.mp4',
    image: '.jpg',
    png: '.png',
  },
};

/**
 * Build a video path based on conditions
 * @param {string} videoName - Base video name (e.g., 'idle', 'intro')
 * @param {Object} options - Path building options
 * @param {boolean} options.isReal - Use photorealistic version
 * @param {string} options.language - Language ('english' or 'german')
 * @returns {string} Complete video path
 */
export function getVideoPath(videoName, { isReal = false, language = 'english' } = {}) {
  const { basePath, suffixes, extensions } = ASSET_CONFIG;

  // Build suffixes
  const avatarSuffix = isReal ? suffixes.real : '';

  // Idle videos don't have language versions
  const langSuffix = (language === 'german' && videoName !== 'idle') ? suffixes.german : '';

  return `${basePath}/${videoName}${avatarSuffix}${langSuffix}${extensions.video}`;
}

/**
 * Build an image path based on conditions
 * @param {string} imageName - Base image name (e.g., 'poster', 'face')
 * @param {Object} options - Path building options
 * @param {boolean} options.isReal - Use photorealistic version
 * @param {boolean} options.isPng - Use PNG extension instead of JPG
 * @returns {string} Complete image path
 */
export function getImagePath(imageName, { isReal = false, isPng = false } = {}) {
  const { basePath, suffixes, extensions } = ASSET_CONFIG;

  const avatarSuffix = isReal ? suffixes.real : '';
  const extension = isPng ? extensions.png : extensions.image;

  return `${basePath}/${imageName}${avatarSuffix}${extension}`;
}

/**
 * Get poster image path
 * @param {boolean} isReal - Use photorealistic version
 * @returns {string} Poster image path
 */
export function getPosterPath(isReal = false) {
  return getImagePath(ASSET_CONFIG.images.poster, { isReal });
}

/**
 * Get face icon path
 * @param {boolean} isReal - Use photorealistic version
 * @returns {string} Face icon path
 */
export function getFaceIconPath(isReal = false) {
  return getImagePath(ASSET_CONFIG.images.face, { isReal });
}

/**
 * Get QR code path
 * @returns {string} QR code path
 */
export function getQRCodePath() {
  return getImagePath(ASSET_CONFIG.images.qr, { isPng: true });
}

/**
 * Preset video paths for common use cases
 */
export const VIDEO_PATHS = {
  idle: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.idle, { isReal, language }),
  intro: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.intro, { isReal, language }),
  introStatic: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.introStatic, { isReal, language }),
  objective: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.objective, { isReal, language }),
  skills: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.skills, { isReal, language }),
  certs: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.certs, { isReal, language }),
  applied: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.applied, { isReal, language }),
  projects: (isReal, language) => getVideoPath(ASSET_CONFIG.videos.projects, { isReal, language }),
};

// Export video names for easy access
export const VIDEO_NAMES = ASSET_CONFIG.videos;
export const IMAGE_NAMES = ASSET_CONFIG.images;
