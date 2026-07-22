# 🎓 Campus Canteen Digital Ordering & Management Platform

A high-performance, full-stack web application designed for university canteens, food courts, and cafeteria management. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Firebase Firestore**, this platform streamlines food ordering for students and simplifies order fulfillment for kitchen staff.
View the app using the link: https://ai.studio/apps/76f79cc6-3a5f-4a8e-a991-418fb3b82d5f?fullscreenApplet=true
---

## ✨ Key Features

### 🍱 For Students & Campus Customers
- **Interactive Visual Menu**: Browse dishes organized by category (*Breakfast, Mains, Beverages, Desserts, Snacks*) with high-resolution food photography, preparation time, price, and clear Veg/Non-Veg indicators.
- **Customization Modal**: Tailor orders with spice preferences (*Mild, Medium, Spicy*), extra add-ons (*Extra Cheese, Extra Sauce, Paratha*), and kitchen notes.
- **Digital Wallet & Payments**: Native virtual wallet balance for instant single-click checkouts alongside UPI, Credit/Debit card, and Cash options.
- **Real-Time Order Tracking**: Live status updates (*Placed → Preparing → Ready for Pickup → Completed*) with pickup counter numbers and verification tokens.
- **Search & Filters**: Quick filters for dietary preferences (Pure Veg), price ranges, and keyword searches.

### 👨‍🍳 For Canteen Management & Kitchen Staff
- **Kitchen Display System (KDS)**: Real-time incoming order dashboard with single-click order status progression.
- **Dynamic Menu Manager**: Add new dishes, edit prices, modify preparation times, and instantly toggle item availability (In-Stock / Out-of-Stock).
- **Transaction Analytics**: Visual metrics tracking daily sales, total orders processed, and revenue breakdowns.
- **Authentication & Roles**: Secure student and admin role-based authentication supported by Firebase Auth & local persistence fallback.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling & Animations**: Tailwind CSS, Motion (`motion/react`), Lucide React Icons
- **Backend & Database**: Firebase Firestore, Firebase Authentication
- **Local Fallback**: Simulated persistent Local Storage engine for offline demo resilience
- **Tooling**: ESLint, PostCSS, TypeScript

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** / **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/campus-canteen-app.git
   cd campus-canteen-app
