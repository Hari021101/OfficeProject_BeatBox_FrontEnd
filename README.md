# BeatBox - Premium E-Commerce Platform

BeatBox is a high-fidelity, full-stack e-commerce application tailored specifically for selling premium watches. The platform provides a seamless, dynamic, and responsive shopping experience, complete with real-time order tracking, live notifications, secure payment processing, and an interactive 3D product showcase. 

## 🚀 Features

- **Modern Shopping Experience**: A sleek, glassmorphic UI with advanced micro-animations for an engaging user journey.
- **Real-Time Notifications & Tracking**: Integrated WebSockets (SignalR) for live push notifications and real-time order tracking.
- **Secure Payments**: Fully integrated Razorpay gateway for safe, fast, and reliable checkout.
- **Dynamic Product Showcase**: Features 3D product elements and interactive swipers to view items in detail.
- **Authentication & Security**: JWT-based authentication combined with role-based access control (Admin & Customer roles).
- **Responsive Design**: Mobile-first approach guaranteeing an optimal view on desktops, tablets, and phones.
- **Robust Cart & Order Management**: Comprehensive state management for carts, wishlists, and order processing.
- **Automated Invoicing**: Dynamic PDF generation for order invoices using QuestPDF.

---

## 🛠️ Tech Stack

### Frontend Architecture
The frontend is built for performance and high visual fidelity, utilizing the latest React patterns.

* **Core**: React 19, Vite (Build Tool & Dev Server)
* **State Management**: Redux Toolkit (RTK) for complex state, React Hook Form for form handling.
* **Routing**: React Router DOM (v7)
* **Styling & UI**: Bootstrap (v5.3), Framer Motion (for advanced animations), Lucide React (Icons)
* **Data Fetching & API**: Axios for RESTful requests
* **Real-time Communication**: `@microsoft/signalr` for WebSocket connectivity
* **Validation**: Zod schema validation
* **Visualization**: Three.js (3D rendering), Recharts (Data visualization for admin dashboards), Swiper (Carousels)

### Backend Architecture
The backend is a robust API engineered using Clean Architecture principles, ensuring scalability and maintainability.

* **Framework**: ASP.NET Core Web API (.NET 9.0)
* **Database & ORM**: Microsoft SQL Server, Entity Framework Core 9.0
* **Authentication**: ASP.NET Core Identity with JWT Bearer tokens
* **Real-Time Services**: ASP.NET Core SignalR (WebSockets)
* **Payment Gateway**: Razorpay Integration
* **Logging & Monitoring**: Serilog with SQL Server and Console Sinks
* **PDF Generation**: QuestPDF (for generating invoices and reports)
* **Architecture Pattern**: Clean Architecture (Domain, Application, Infrastructure, API Layers)

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- .NET 9.0 SDK
- SQL Server (LocalDB or full instance)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd beatbox
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env.development` file with the following:
   ```env
   VITE_API_URL=http://localhost:5089
   VITE_SIGNALR_URL=http://localhost:5089
   VITE_RAZORPAY_KEY=your_razorpay_key_here
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to the API directory:**
   ```bash
   cd OfficeProject_BeatBox_BackEnd/API
   ```
2. **Configure Database & Secrets:**
   Update `appsettings.json` with your SQL Server connection string, JWT secret, Email credentials, and Razorpay secrets.
3. **Apply Migrations (Optional - applies automatically on startup):**
   ```bash
   dotnet ef database update
   ```
4. **Run the API:**
   ```bash
   dotnet run
   ```
   *The API will automatically apply EF migrations and seed the initial catalog data.*

---

## 📦 Deployment
- **Frontend**: Optimized for deployment on platforms like Vercel, Netlify, or GitHub Pages.
- **Backend**: Hosted on MonsterASP (or any IIS/Linux server supporting .NET 9). Ensure that `ASPNETCORE_ENVIRONMENT` is set to `Production` to enable specific security features and database logs.

## 📄 License
This project is proprietary and developed for internal/portfolio purposes.
