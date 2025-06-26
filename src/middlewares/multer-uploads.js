import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import { extname } from "path";


cloudinary.v2.config({
  cloud_name: "ddchtdi5y",
  api_key: "598451487432635",
  api_secret: "GSjR--r38TGbNrbWcJizcdOe0ys",
});

const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "profileUserKivora",
    public_id: (req, file) => {
      const flieExtension = extname(file.originalname);
      const fileName = file.originalname.split(flieExtension)[0];
      return `${fileName}-${Date.now()}`;
    },
  },
});

const storageTaskFiles = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "taskFilesKivora",
    public_id: (req, file) => {
      const fileExtension = extname(file.originalname);
      const fileName = file.originalname.split(fileExtension)[0];
      return `${fileName}-${Date.now()}`;
    },
    allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf", "docx", "xlsx", "pptx"],
  },
});

const taskFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",    
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" 
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"));
  }
};

export const uploadProfilePicture = multer({
  storage: profileImageStorage,
  fileFilter: (req, file, cb) => {
    cb(null, true); 
  },
  limits: {
    fileSize: 10000000,
  },
});

export const uploadTaskFiles = multer({
  storage: storageTaskFiles,
  fileFilter: taskFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});
