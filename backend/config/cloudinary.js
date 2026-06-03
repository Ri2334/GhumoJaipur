import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

console.log("Checking Cloudinary Environment Variables:");
console.log("- CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "PRESENT" : "MISSING");
console.log("- CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING");
console.log("- CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("Multer-Storage-Cloudinary: Preparing params for file:", file.originalname);
    return {
      folder: 'ghumo_jaipur/drivers',
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'webp', 'avif'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

console.log("Cloudinary Storage Initialized");

const upload = multer({ storage: storage });

export { cloudinary, upload };
