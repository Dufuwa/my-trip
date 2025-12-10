/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lifted: '0 20px 80px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'mesh-blue': 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15), transparent 35%), radial-gradient(circle at 80% 0%, rgba(99, 102, 241, 0.12), transparent 30%)',
      },
    },
  },
  plugins: [],
};
