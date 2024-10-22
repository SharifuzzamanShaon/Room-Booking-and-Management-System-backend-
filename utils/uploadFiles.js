const cloudinary = require("cloudinary").v2;

const fs = require("fs");

cloudinary.config({
  cloud_name: "daaxwtbba",
  api_key: "416624678919151",
  api_secret: "CT9o3mEVvEQ0Dp1kbNNMFfg-BMI",
});

const uploadOnCloudinary = async (buffer) => {
  try {
    if (!buffer) return null;
    const response = await cloudinary.uploader.upload(buffer, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    fs.unlinkSync(buffer);
    return null;
  }
};

module.exports = { uploadOnCloudinary };

