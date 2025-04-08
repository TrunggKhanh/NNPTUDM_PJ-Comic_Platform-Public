const cloudinary = require("../config/cloudinaryClient");
const fs = require("fs");

const uploadImageToCloudinary = async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ message: "Vui lòng upload ảnh bìa!" });
    }

    const result = await cloudinary.uploader.upload(image.path, {
      folder: "comics",
      use_filename: true,
      unique_filename: false,
    });

    req.imageUrl = result.secure_url; // URL ảnh bìa
    fs.unlinkSync(image.path); // Xóa file tạm
    next();
  } catch (error) {
    console.error("Lỗi khi upload ảnh lên Cloudinary:", error);
    res.status(500).json({ message: "Lỗi khi upload ảnh lên Cloudinary.", error });
  }
};

module.exports = { uploadImageToCloudinary };
