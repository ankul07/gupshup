import cloudinary from "cloudinary";
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
//   api_key: process.env.CLOUDINARY_CLIENT_API,
//   api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
// });
cloudinary.config({
  cloud_name: "ankulcode",
  api_key: "912362469142619",
  api_secret: "7HQnJIQSr2v75ImIjEB_Bx02E00",
});
export default cloudinary;
