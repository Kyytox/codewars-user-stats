import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "https://kyytox.github.io/",
    // base: "http://127.0.0.1:5000/",
});
