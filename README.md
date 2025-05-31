# Product Hunt Clone – Technical Assignment

## 🛠 Tech Stack

* **Frontend**: Nuxt 3 (Vue 3 Composition API)
* **UI Components**: Vue Shadcn (Tailwind CSS-based)
* **Backend**: Express.js
* **Database**: MongoDB with Mongoose

## ✅ Completed Features

### Frontend (Nuxt 3)

* UI implementation for:

  * Authentication pages (Login/Register)
  * Product submission form
  * Explore/home page layout
  * Product detail page structure

### Backend (Express.js + MongoDB)

* JWT-based authentication (Register/Login)
* Auth middleware
* API Routes:

  * `POST /auth/register`
  * `POST /auth/login`
  * `POST /products` (protected)
  * `GET /products` (all products)
  * `GET /products/:id` (single product)

## ❌ Pending

* Full frontend-backend integration (API connection)
* Upvote and comment systems
* Deployment to Vercel/Render


## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nikhil-Nadkar/kulp_producthunt
cd kulp_producthunt
```

### 2. Install dependencies

```
npm install

```

### 3. Create `.env` file for backend

Create a `.env` file inside the `main` directory with the following variables:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the project

```
npm run dev
```

