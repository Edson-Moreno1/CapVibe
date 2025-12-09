/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // <--- IMPORTANTE: Escanea tus archivos Angular
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui") // <--- Agregamos DaisyUI de una vez
  ],
  daisyui: {
    themes: ["light", "dark"], // Temas configurados
  },
}