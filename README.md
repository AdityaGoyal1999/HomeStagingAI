# 🏠 HomeStaging AI

Transform empty houses into dream homes with AI-powered virtual staging. Professional interior design in minutes, not weeks.

## ✨ Features

### 🎨 AI-Powered Virtual Staging
- **Instant Results**: Get professionally staged photos in less than 15 seconds
- **Multiple Style Options**: Choose from dozens of interior design styles (modern, traditional, minimalist, luxury)
- **Photorealistic Quality**: Advanced AI algorithms generate stunning, realistic staged interiors
- **Property-Specific**: Tailored staging based on your property type and target market

### 💰 Cost & Time Savings
- **Cost Savings**: Virtual staging costs a fraction of traditional staging
- **Faster Sales**: Properties sell significantly faster with professional staging
- **Average Price Increase**: Boost property value with strategic staging
- **5-Minute Setup**: No waiting weeks for physical staging or photographer schedules

### 🔧 Technical Features
- **User Authentication**: Secure Firebase Authentication with email/password
<!-- - **File Upload**: Support for high-resolution image uploads (up to 15MB) -->
- **Payment Integration**: Stripe-powered subscription and pay-per-use model
- **Real-time Processing**: Instant AI processing with progress tracking
<!-- - **Responsive Design**: Beautiful UI that works on all devices -->

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Chakra UI** - Component library for rapid development
- **React Router** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Axios** - HTTP client for API requests

### Backend
- **Firebase Functions** - Serverless backend
- **Express.js** - Web application framework
- **Firebase Admin SDK** - Backend Firebase integration
- **Firestore** - NoSQL cloud database
- **Firebase Storage** - File storage for images

### AI & External Services
- **Replicate AI** - AI model hosting and inference
- **Stripe** - Payment processing and subscriptions
- **Firebase Authentication** - User management


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase CLI
- Stripe account
- Replicate AI account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HomeStaging
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd functions
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=http://localhost:5001/your_project/us-central1/api
   ```

   Create `.env` file in the `functions` directory:
   ```env
   REPLICATE_API_TOKEN=your_replicate_token
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   FRONTEND_URL=https://home-staging-ai.vercel.app
   ```

5. **Firebase Setup**
   ```bash
   firebase login
   firebase init
   firebase use your_project_id
   ```

### Development

1. **Start Firebase Emulators**
   ```bash
   firebase emulators:start
   ```

2. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

3. **Deploy Functions (for production)**
   ```bash
   cd functions
   npm run deploy
   ```

### Available Scripts

```bash
# Frontend
npm run dev              # Start development server
npm run dev:emulator     # Start with Firebase emulator
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Backend (from functions directory)
npm run serve           # Start functions emulator
npm run deploy          # Deploy to Firebase
npm run logs            # View function logs
```

## 📱 Usage

1. **Sign Up**: Create an account with your email
2. **Upload Photos**: Upload high-quality photos of empty rooms
3. **Choose Style**: Select from multiple interior design styles
4. **Generate**: Get AI-staged photos in seconds
5. **Download**: Download high-resolution images for marketing


## 🏗️ Project Structure

```
HomeStaging/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── LandingPage/         # Landing page components
│   │   └── ui/                  # Base UI components
│   ├── page/                    # Page components
│   ├── context/                 # React context providers
│   ├── auth/                    # Authentication utilities
│   └── assets/                  # Static assets
├── functions/                    # Firebase Functions backend
│   ├── controllers/             # Request handlers
│   ├── middleware/              # Express middleware
│   ├── models/                  # Data models
│   ├── routes/                  # API routes
│   ├── services/                # Business logic
│   └── utils/                   # Utility functions
├── public/                      # Public static files
└── dist/                        # Production build output
```

## 🔐 Environment Variables

### Frontend (.env)
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_API_URL` - Backend API URL

### Backend (functions/.env)
- `REPLICATE_API_TOKEN` - Replicate AI API token
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `FRONTEND_URL` - Frontend URL for CORS


### Backend (Firebase Functions)
```bash
cd functions
npm run deploy
```

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- **Replicate AI** for providing the AI models
- **Firebase** for the backend infrastructure
- **Stripe** for payment processing
- **Vercel** for frontend hosting
- **Tailwind CSS** for the beautiful UI framework

---
