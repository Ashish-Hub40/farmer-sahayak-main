![OG Image](public/og.webp)

# Farmer Sahayak - AI Agricultural Advisor

A multilingual AI-powered advisory system designed for farmers in India. This application provides comprehensive agricultural guidance through voice input, image analysis, and AI-driven recommendations, supporting 11 Indian languages.

## Features

- **Multilingual Support**: Available in 11 Indian languages - Hindi, Bengali, English, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu
- **No-Login Experience**: Seamless user experience with automatic session management using UUID stored in LocalStorage
- **Hybrid Audio System**:
  - Browser-native TTS for UI elements (fast and free)
  - Sarvam AI TTS for chat responses (high-quality, natural voice)
- **Multi-Modal Input**:
  - Text-based queries
  - Voice recognition using Web Speech API
  - Image upload for plant disease detection and crop analysis
- **Real-Time Weather Integration**: Contextual farming advice based on current weather data
- **AI-Powered Plant Health Analysis**: Disease detection using Kindwise API (Plant.id and Crop.health)
- **Progressive Web App (PWA)**: Installable on mobile devices for offline access
- **Comprehensive Agricultural Tools**: Crop insights, farming almanac, government schemes information, and learning resources

## Technologies Used

### Frontend Framework
- **Next.js 16.0.10**: React framework with App Router for server-side rendering and API routes
- **React 19.2.1**: UI library for building interactive components
- **TypeScript 5**: Type-safe JavaScript for better development experience

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework for responsive design
- **Framer Motion 12.23.26**: Animation library for smooth UI transitions
- **Lucide React 0.561.0**: Icon library for consistent UI elements
- **@tailwindcss/typography 0.5.19**: Typography plugin for rich text formatting

### State Management & Data
- **Zustand 5.0.9**: Lightweight state management solution
- **SWR 2.3.8**: React hooks for data fetching and caching
- **Drizzle ORM 0.45.1**: Type-safe SQL query builder
- **Vercel Postgres 0.10.0**: Serverless PostgreSQL database
- **@vercel/blob 2.0.0**: Blob storage for file uploads

### AI & External APIs
- **AI SDK 5.0.113**: Framework for integrating AI services
- **Sarvam AI**: For conversational AI chat and text-to-speech
- **Kindwise API**: Plant identification and crop health analysis
- **OpenWeather API**: Real-time weather data

### Speech & Audio
- **React Speech Recognition 4.0.1**: Voice input processing
- **Regenerator Runtime 0.14.1**: Polyfill for async/await in older browsers

### Internationalization & Utilities
- **i18next 25.7.3**: Internationalization framework
- **React i18next 16.5.0**: React bindings for i18next
- **React Markdown 10.1.0**: Markdown rendering in React
- **Remark GFM 4.0.1**: GitHub Flavored Markdown support
- **Tailwind Merge 3.4.0**: Utility for merging Tailwind classes
- **clsx 2.1.1**: Utility for constructing CSS class strings

### Development Tools
- **ESLint 9**: Code linting and formatting
- **TypeScript 5**: Type checking
- **Drizzle Kit 0.31.8**: Database migration tool
- **Next PWA 5.6.0**: PWA configuration
- **PostCSS**: CSS processing (configured via postcss.config.mjs)

## Prerequisites

- **Node.js 18+**: Required for running the Next.js application
- **npm or yarn**: Package manager for installing dependencies
- **API Keys**: Required for external services
  - Neon Postgres Database URL
  - Sarvam AI API Key
  - Kindwise Plant.id API Key
  - Kindwise Crop.health API Key
  - OpenWeather API Key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd farmer-sahayak-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory, or copy the provided `.env.local.example` file:

```bash
cp .env.local.example .env.local
```

Then fill in your real values:

```env
# Database Configuration (Neon Postgres)
DATABASE_URL="postgresql://username:password@hostname/database"
POSTGRES_URL="postgresql://username:password@hostname/database"
POSTGRES_URL_NON_POOLING="postgresql://username:password@hostname/database"

# API Keys
SARVAM_API_KEY="your_sarvam_api_key_here"
PLANT_ID_API_KEY="your_plant_id_api_key_here"
CROP_HEALTH_API_KEY="your_crop_health_api_key_here"
OPENWEATHER_API_KEY="your_openweather_api_key_here"

# Optional Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

Push the database schema to your Neon Postgres instance:

```bash
npm run db:push
```

### 5. Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 6. Production Build

To build and run for production:

```bash
npm run build
npm start
```

## Project Structure

```
farmer-sahayak-main/
├── actions/                    # Server actions and API handlers
│   ├── analyze-image.ts       # Image analysis for plant diseases
│   ├── chat-storage.ts        # Chat history management
│   ├── crop-insights.ts       # Crop-related insights
│   ├── plant-history.ts       # Plant growth tracking
│   ├── sarvam-chat.ts         # AI chat integration
│   ├── sarvam-tts.ts          # Text-to-speech
│   ├── translate-text.ts      # Text translation
│   └── weather.ts             # Weather data fetching
├── app/                       # Next.js app directory
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── almanac/               # Farming almanac page
│   ├── api/                   # API routes
│   ├── chat/                  # Chat interface
│   ├── crop-doctor/           # Crop disease diagnosis
│   ├── image/                 # Image upload/analysis
│   ├── insights/              # Agricultural insights
│   ├── learn/                 # Learning resources
│   ├── schemes/               # Government schemes
│   └── voice/                 # Voice interface
├── components/                # React components
│   ├── Dashboard.tsx          # Main dashboard
│   ├── ErrorBoundary.tsx      # Error handling
│   ├── FarmingBackground.tsx  # Background component
│   ├── I18nProvider.tsx       # Internationalization provider
│   ├── LanguageSelector.tsx   # Language selection
│   ├── ProfileHeader.tsx      # User profile header
│   ├── cards/                 # Card components
│   ├── Chat/                  # Chat components
│   └── ui/                    # UI components
├── drizzle/                   # Database schema
│   └── schema.ts              # Drizzle ORM schema
├── hooks/                     # Custom React hooks
│   ├── useChat.ts             # Chat functionality
│   └── useStreamingTTS.ts     # Streaming TTS
├── lib/                       # Utility libraries
│   ├── audio.ts               # Audio processing
│   ├── blob-storage.ts        # File storage
│   ├── db.ts                  # Database connection
│   ├── i18n.ts                # Internationalization config
│   ├── image-compression.ts   # Image optimization
│   └── languages.ts           # Language configurations
├── public/                    # Static assets
│   └── manifest.json          # PWA manifest
├── store/                     # State management
│   └── useStore.ts            # Zustand store
├── drizzle.config.ts          # Drizzle configuration
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS config (if exists)
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:push`: Push database schema
- `npm run db:studio`: Open Drizzle Studio for database management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for Indian farmers to leverage AI for better agricultural practices
- Powered by modern web technologies and AI services
- Supports sustainable farming through informed decision-making
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Database (Neon Postgres)
DATABASE_URL="postgresql://..."
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# API Keys
SARVAM_API_KEY="your_sarvam_api_key"
PLANT_ID_API_KEY="your_plant_id_api_key"
CROP_HEALTH_API_KEY="your_crop_health_api_key"
OPENWEATHER_API_KEY="your_openweather_api_key"

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

Push the schema to your Neon database:

```bash
npm run db:push
```

### 4. Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
farmer/
├── actions/          # Server Actions (API integrations)
│   ├── weather.ts
│   ├── analyze-image.ts
│   ├── sarvam-chat.ts
│   └── sarvam-tts.ts
├── app/              # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/       # React Components
│   ├── Chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── InputArea.tsx
│   ├── ui/
│   │   └── SpeakingButton.tsx
│   ├── LanguageSelector.tsx
│   └── WeatherWidget.tsx
├── drizzle/          # Database Schema
│   └── schema.ts
├── hooks/            # Custom React Hooks
│   └── useChat.ts
├── lib/              # Utilities
│   ├── audio.ts
│   ├── db.ts
│   └── languages.ts
├── store/            # Zustand State
│   └── useStore.ts
└── public/           # Static Assets
    └── manifest.json
```

## Key Features Implementation

### Hybrid Audio Strategy

**UI Elements** (Weather, Buttons):
```typescript
import { speakNative } from "@/lib/audio";
speakNative("Hello farmer", "hi-IN");
```

**AI Chat Responses**:
- Text generated by Sarvam Chat API
- Audio generated by Sarvam TTS API
- Stored as base64 and auto-played in MessageBubble

### Voice Input

Uses `react-speech-recognition` with browser's native Web Speech API:
```typescript
const { transcript, listening } = useSpeechRecognition();
SpeechRecognition.startListening({ language: "hi-IN" });
```

### Image Analysis

Upload plant images for disease detection:
- Processed by Kindwise Plant.id or Crop.health API
- Results include disease name, probability, treatment, symptoms

### Weather Context

Fetches local weather and includes in LLM prompt for contextual advice.

## API Documentation

- **Sarvam AI**: See `sarvam.md`
- **Kindwise**: See `kindwise.md`

## Database Schema

**chats** table:
- id (UUID)
- session_id (Text)
- role (user | assistant)
- content (Text)
- audio_base64 (Text, optional)
- image_url (Text, optional)
- timestamp (Timestamp)

**user_settings** table:
- session_id (Text, PK)
- language (Text)
- lat (Text)
- lon (Text)

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Browser Support

- Chrome/Edge: Full support (recommended)
- Firefox: Full support
- Safari: Limited speech recognition support
- Mobile browsers: Install as PWA for best experience

## Troubleshooting

### Speech Recognition Not Working
- Ensure you're using HTTPS (required for microphone access)
- Check browser compatibility
- Grant microphone permissions

### API Errors
- Verify all API keys in `.env.local`
- Check API rate limits
- Ensure database connection string is correct

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check Node.js version (18+)

## License

MIT

## Contributors

Built with ❤️ for Indian farmers
