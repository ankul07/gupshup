import { v2 as cloudinary } from "cloudinary";
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
//   api_key: process.env.CLOUDINARY_CLIENT_API,
//   api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
// });
cloudinary.config({
  cloud_name: "duobilb56",
  api_key: "556183788849112",
  api_secret: "LU3T0_s6RJuDnpWm4YbyuY7glsY",
});
export default cloudinary;
