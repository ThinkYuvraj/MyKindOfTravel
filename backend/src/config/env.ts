import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory first, then root directory fallback
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isDist = process.argv[1] ? (process.argv[1].includes('dist') || process.argv[1].endsWith('.cjs')) : false;

export const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || (isDist ? 'production' : 'development'),
  adminEmail: process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || 'marketing2glue@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'Admin@8369',
  googleMapsApiKey:
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyDSXpG7hgCo6-ldcQ6BoUOZhRAl0SkYhQg',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
};
