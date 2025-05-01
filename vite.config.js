import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tailwindcssForms from "@tailwindcss/forms";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      plugins: [tailwindcssForms()],
    }),
  ],
});
