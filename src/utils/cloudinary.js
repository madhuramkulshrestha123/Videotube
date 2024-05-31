import {v2 as cloudinary} from "cloudinary";
import fs from "fs" // fs: file-system (R/w/open directory...)

import {v2 as cloudinary} from 'cloudinary';



// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {
    try {

        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        //file has been uploaded successfully
        console.log("File is uploaded on cloudinary",response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) //Remove the locally saved temporary file as the upload got failed
        return null;
    }
}

export {uploadOnCloudinary}

