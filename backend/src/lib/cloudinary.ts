import { v2 as cloudinary } from 'cloudinary';
import logger from './logger';

export function configureCloudinary(cloudName: string, apiKey: string, apiSecret: string) {
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
    logger.info('Cloudinary configured successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to configure Cloudinary');
  }
}

export { cloudinary };
