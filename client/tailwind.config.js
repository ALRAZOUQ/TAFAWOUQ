export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"], // Add Cairo font
      },
      colors: {
        TAF: { 100: "#0b8eca", 200: "#e4f4fe", 300: "#d2ebfa" },//B3DDF5    for grediant  879097 in course inside the container
      },
    },
  },
  plugins: [],
};
