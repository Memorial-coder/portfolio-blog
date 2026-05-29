# Portfolio Blog Template

A high-performance, developer-focused portfolio template built with **React**, **Context API**, and **CSS Modules**. Designed for those who appreciate minimalism, glassmorphism, and performance.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Context API](https://img.shields.io/badge/Context_API-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![CSS Modules](https://img.shields.io/badge/css_modules-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![FontAwesome](https://img.shields.io/badge/Font_Awesome-333333?style=for-the-badge&logo=font-awesome&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![EmailJS](https://img.shields.io/badge/EmailJS-F15A24?style=for-the-badge&logo=mail-dot-ru&logoColor=white)
![React Helmet](https://img.shields.io/badge/React_Helmet-000000?style=for-the-badge&logo=react&logoColor=white)

[Live Demo](https://monodemo.netlify.app) | [Documentation Guide](docs/README.md)

## ✨ Features

- **⚡ High Performance**: Optimized with `IntersectionObserver` for scroll spy and animation, plus lazy loading for routes.
- **🎨 Glassmorphism & Monochrome Design**: A sleek, modern aesthetic using CSS variables for consistent theming.
- **📱 Fully Responsive**: Looks great on mobile, tablet, and desktop.
- **🏷️ Centralized Config**: Change your name, bio, and links in one file (`src/data/config.js`).
- **� Functional Contact Form**: Built with EmailJS integration, featuring real-time validation and error handling.
- **�️ Robust & Secure**: Image fallback handling, environment variable management, and prop type validation.
- **🔍 SEO Optimized**: Dynamic page titles and meta descriptions using `react-helmet-async`.
- **🧩 Clean Code Architecture**: Component-based structure with separated styles (CSS Modules) and logic.

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Configuration

**Personal Information:**
Update `src/data/config.js` with your personal details, social links, and SEO settings.

**Environment Variables:**
Create a `.env` file in the root directory (copy from `.env.example` if available) and add your EmailJS keys:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### 3. Run Locally

```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📂 Project Structure

```
src/
├── components/    # Reusable UI components (Home, Projects, etc.)
├── config/        # Environment and constants configuration
├── context/       # React Context (AppContext) for global state
├── data/          # Static data (projects, skills, config)
├── hooks/         # Custom hooks (useScrollAnimation)
├── styles/        # CSS Modules and global variables
└── App.js         # Main application component with routing
```

## 🎨 Customization

This project is built to be easily customized. The design system is based on **CSS Variables**, meaning you can change the entire look (accent colors, fonts, blur intensity) by editing `src/styles/variables.css`.

## 📄 License

MIT License - feel free to use this for your personal or professional projects.

---
Template attribution is preserved in LICENSE.