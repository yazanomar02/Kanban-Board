/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ألوان النهار
        day: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // ألوان الليل
        night: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          500: '#94a3b8',
          600: '#cbd5e1',
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc',
        },
        accent: {
          day: {
            blue: '#3b82f6',
            green: '#10b981',
            purple: '#8b5cf6',
            pink: '#ec4899',
            orange: '#f97316',
          },
          night: {
            blue: '#60a5fa',
            green: '#34d399',
            purple: '#a78bfa',
            pink: '#f472b6',
            orange: '#fb923c',
          }
        }
      },
      backgroundImage: {
        // تدرجات النهار
        'gradient-day-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-day-secondary': 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        'gradient-day-light': 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        'gradient-day-surface': 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        
        // تدرجات الليل
        'gradient-night-primary': 'linear-gradient(135deg, #1e40af 0%, #5b21b6 100%)',
        'gradient-night-secondary': 'linear-gradient(135deg, #065f46 0%, #1e40af 100%)',
        'gradient-night-dark': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        'gradient-night-surface': 'linear-gradient(135deg, #1e293b 0%, #312e81 100%)',
        
        // تدرجات خاصة
        'gradient-rainbow': 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981)',
        'gradient-fire': 'linear-gradient(90deg, #f59e0b, #ef4444, #ec4899)',
        'gradient-ocean': 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
        'gradient-forest': 'linear-gradient(90deg, #10b981, #059669, #047857)',
      },
      boxShadow: {
        // ظلال النهار
        'day-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'day-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'day-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'day-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        
        // ظلال الليل
        'night-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'night-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'night-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
        'night-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
        
        // ظلال ملونة
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}