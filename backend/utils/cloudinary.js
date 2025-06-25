import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    console.log("Uploading file:", localFilePath);
    console.log("File size (bytes):", fs.statSync(localFilePath).size);


    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    fs.unlinkSync(localFilePath); // delete local file
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localFilePath); // still delete local file
    return null;
  }
};
