# Professional Monochrome Portfolio Template

Welcome to the **Premium Monochrome Portfolio Template**! This project is designed to be a "plug-and-play" solution for developers who want a sleek, high-performance portfolio with React.

## 🚀 Quick Start

1.  **Clone & Install**
    ```bash
    npm install
    ```
2.  **Configure Your Info**
    Open `src/data/config.js` and fill in your name, bio, social links, and SEO details. Everything updates automatically across the site!
3.  **Setup EmailJS** (Optional but Recommended)
    Add your keys to the `.env` file to make the contact form functional.
4.  **Run Locally**
    ```bash
    npm start
    ```

---

## 🛠 Project Highlights

- **🌓 Dual-Theme**: Sleek Black & White design with instant switching.
- **💎 Glassmorphism**: Premium frosted glass effects on cards and modals.
- **📝 Markdown Blog**: Write your tech notes in `.md` and they'll render beautifully with syntax highlighting.
- **⚡ Performance**: Optimized with WebP assets and code-splitting.
- **📱 Responsive**: Perfect look on any screen size.

---

## 📚 Specialized Guides

To make customization easier, check out these detailed guides:

- [**Writing Blog Posts**](./BLOG_GUIDE.md) - How to use the Markdown blog system.
- [**Theme Customization**](./THEME_CUSTOMIZATION.md) - Changing colors, fonts, and glass effects.
- [**Troubleshooting**](./TROUBLESHOOTING.md) - Solutions for EmailJS and deployment issues.

---

## 🎨 Customization Guide

### 1. Global Branding
Edit `src/data/config.js`. This is the heart of the template. It controls:
- Your Name & Nickname (Logo)
- Bio & Professional details
- Social Media URL redirects
- Contact Information (Phone, Email, Location)
- SEO Meta-tags (OG images, descriptions)

### 2. Projects & Skills
- **Projects**: Manage your portfolio items in `src/data/projects.js`.
- **Skills**: Add or remove your tech stack in `src/data/skills.js`.

### 3. Writing Blog Posts
Posts are stored in `public/posts/`. 
- Create a `.md` file with a slug (e.g., `my-post.md`).
- Register the post in `src/components/Blog.js` to show it on the grid.

### 4. Theme Colors
To change the accent colors or glass intensity, edit the variables in `src/index.css`. Look for:
```css
:root {
  --primary-accent: #ffffff; /* Example: Change to #00ff00 for a Neon look */
  --glass-backdrop: blur(10px);
}
```

---

## 📦 Deployment

1. Set the build command: `npm run build`.
2. Output directory: `build`.
3. **Environment Variables**: Make sure to add `REACT_APP_EMAILJS_SERVICE_ID`, etc., in your hosting dashboard (Vercel/Netlify).

---
Template attribution is preserved in LICENSE.
