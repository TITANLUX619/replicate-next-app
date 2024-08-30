export const baseURL = process.env.REACT_APP_BASE_URL;

export const publicRoutes = [
  '/new-verification',
  '/api/uploadthing'
];
export const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/new-password',
  '/reset-password'
];
export const apiAuthPrefix = '/api/auth';
export const DEFAULT_SIGN_IN_REDIRECT = '/';
export const DEFAULT_SIGN_OUT_REDIRECT = '/sign-in';
export const DEFAULT_SIGN_UP_REDIRECT = '/sign-in';