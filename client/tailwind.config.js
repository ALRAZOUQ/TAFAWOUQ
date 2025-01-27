export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"], // Add Cairo font
      },
      colors: {
        TAF: { 100: "#0b8eca", 200: "#1b8acb", 300: "#0a7dc4" },
      },
    },
  },
  plugins: [],
};
