require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

const images = [
  "./images/aldebaran-s-uXchDIKs4qI-unsplash.jpg",
  "./images/brian-mcgowan-I0fDR8xtApA-unsplash.jpg",
  "./images/spacex-OHOU-5UVIYQ-unsplash.jpg",
  "./images/spacex-VBNb52J8Trk-unsplash.jpg",
  "./images/stellan-johansson-1PP0Fc-KSd4-unsplash.jpg",
];

exports.imageUpload = async (image) => {
  const result = await cloudinary.uploader.upload(
    "./140488126_205908281268001_5823419409824530938_n.png"
  );
  console.log(`Successfully uploaded ${image}`);
  console.log(`> Result: ${result.secure_url}`);
  return result;
};
