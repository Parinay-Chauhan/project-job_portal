import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // console.log("UPLOAD PATH:", localFilePath);
    // console.log("FILE EXISTS BEFORE UPLOAD:", fs.existsSync(localFilePath));

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("CLOUDINARY UPLOAD SUCCESS");

    // console.log("FILE EXISTS BEFORE DELETE:", fs.existsSync(localFilePath));

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      // console.log("FILE DELETED SUCCESSFULLY");
    }

    // console.log("FILE EXISTS AFTER DELETE:", fs.existsSync(localFilePath));

    return response;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      // console.log("FILE DELETED AFTER ERROR");
    }

    return null;
  }
};
export { uploadOnCloudinary };
