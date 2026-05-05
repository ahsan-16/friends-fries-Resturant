# 🍟 Friends Fries And Fast Food — Website

A modern, fast, SEO-friendly fast food restaurant website built with React + Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation & Run

```bash
# 1. Enter the project folder
cd friends-fries

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
friends-fries/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Top navigation with cart & auth
│   │   │   └── Footer.jsx          # Footer with links & contact
│   │   ├── sections/
│   │   │   ├── Hero.jsx            # Landing hero section
│   │   │   ├── FeaturedCategories.jsx
│   │   │   └── ReviewsSection.jsx
│   │   └── ui/
│   │       ├── MenuItemCard.jsx    # Item card + detail modal popup
│   │       ├── CartDrawer.jsx      # Slide-in cart drawer
│   │       └── AuthModal.jsx       # Sign in / Sign up modal
│   ├── context/
│   │   ├── CartContext.jsx         # Global cart state (localStorage)
│   │   └── AuthContext.jsx         # Auth state (localStorage)
│   ├── data/
│   │   └── menu.js                 # All menu items, deals, reviews, info
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── MenuPage.jsx            # Reusable menu page with search/filter
│   │   ├── CategoryPages.jsx       # Burgers, Pizza, Shawarma, Fries, Drinks
│   │   ├── DealsPage.jsx
│   │   ├── ReviewsPage.jsx
│   │   └── ContactPage.jsx
│   ├── App.jsx                     # Router + providers
│   ├── main.jsx
│   └── index.css                   # Tailwind + custom styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## ✨ Features

- **Full Menu** with 40+ items across 6 categories
- **Item Detail Popup** — click any item to see full details + add to cart
- **Cart System** — add, remove, update quantity, WhatsApp order
- **Auth System** — Sign Up / Sign In (localStorage-based)
- **Search & Filter** on every category page
- **9 Deal Combos** with detailed breakdown
- **Reviews Page** — read & write reviews (when signed in)
- **Contact Page** — map, phone, hours, WhatsApp link
- **Fully Responsive** — mobile-first design
- **SEO Meta Tags** — title, description, og tags
- **Dark Fast-Food Aesthetic** — bold typography, red/yellow brand colors

## 🛠 Tech Stack

- React 18 + React Router 6
- Tailwind CSS 3
- Vite 5
- react-hot-toast (notifications)
- lucide-react (icons)

## 📞 Restaurant Info

- **Name:** Friends Fries And Fast Food
- **Address:** Dubai Kitchen, Line, 10 Qabristan Rd, Wah Cantt
- **Order:** 0309-5194149
- **Phone:** 03155305988
