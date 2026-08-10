import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Verify environment variables are available
// if (!process.env.CLOUDINARY_API_KEY) {
//     console.error("❌ Cloudinary API key is missing. Check your .env file.");
//     console.log("Expected environment variables:", {
//         CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "✓" : "✗",
//         CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "✓" : "✗",
//         CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✓" : "✗"
//     });
// }

cloudinary.config({ 
    // we got error here if forgot spacing after comma 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null;

        //upload the file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        console.log("✅ File uploaded to Cloudinary:", response.secure_url);
        // Remove file from local storage after successful upload
        fs.unlinkSync(localFilePath); 

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);

        // Delete temp file if upload fails
        if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        }

        return null;
        
    }
}


export {uploadOnCloudinary};