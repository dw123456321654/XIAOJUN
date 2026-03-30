/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          bg: '#EFF6FF'
        },
        secondary: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#6B7280'
        },
        neutral: {
          heading: '#111827',
          title: '#374151',
          body: '#6B7280',
          body2: '#9CA3AF',
          border: '#E5E7EB',
          bg: '#F9FAFB',
          card: '#FFFFFF'
        }
      },
      fontSize: {
        'h1': '32px',
        'h2': '24px',
        'h3': '20px',
        'h4': '18px',
        'body': '14px',
        'small': '12px',
        'code': '13px'
      },
      spacing: {
        'xs': '4px',
        's': '8px',
        'm': '16px',
        'l': '24px',
        'xl': '32px',
        'xxl': '48px'
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px'
      },
      boxShadow: {
        'none': 'none',
        'small': '0 1px 2px rgba(0,0,0,0.05)',
        'medium': '0 4px 6px rgba(0,0,0,0.07)',
        'large': '0 10px 15px rgba(0,0,0,0.1)'
      }
    }
  },
  plugins: [],
}
