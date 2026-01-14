/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3b82f6',
                    focus: '#2563eb',
                }
            }
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#3b82f6",
                    "primary-focus": "#2563eb",
                    "primary-content": "#ffffff",
                    "secondary": "#60a5fa",
                    "accent": "#93c5fd",
                    "neutral": "#1f2937",
                    "base-100": "#fafaf9",
                    "base-200": "#f5f5f4",
                    "base-300": "#e7e5e4",
                    "base-content": "#1f2937",
                    "info": "#3b82f6",
                    "success": "#22c55e",
                    "warning": "#f59e0b",
                    "error": "#ef4444",
                },
            },
        ],
    },
}
