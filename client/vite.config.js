import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: true, // External access allow karega
  //   strictPort: true, // Fix port rakhega
  //   allowedHosts: [".ngrok-free.app"], // Ngrok ke hosts allow karega
  // },
});
