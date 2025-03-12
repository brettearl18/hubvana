# CheckinApp - Coach-Client Progress Tracking Platform

A modern web application built with React and Firebase that streamlines client check-ins and progress tracking for coaches. The platform provides real-time updates, customizable templates, and an intuitive interface for managing client interactions.

## 🚀 Features

### Authentication & User Management
- Firebase Authentication integration
- Role-based access (Coach/Client)
- Profile management with bio and preferences
- Protected routes based on user roles

### Coach Dashboard
- Client overview with key metrics
- Real-time client status updates
- Sample data initialization
- Progress tracking visualization
- Client management interface
- Customizable check-in templates

### Client Features
- Easy check-in submission
- Progress tracking
- Goal setting and monitoring
- File attachments for progress photos
- Historical data view

### Check-in System
- Customizable templates
- Multiple question types:
  - Text input
  - Number input
  - Sliders
  - Radio buttons
  - Checkboxes
- Progress visualization
- Historical data tracking

## 🛠 Tech Stack

### Frontend
- React 18.2.0
- TypeScript
- Vite (Build tool)
- Chakra UI (Component library)
- React Router (Navigation)
- React Hook Form (Form management)
- React Beautiful DnD (Drag-and-drop functionality)
- Recharts (Data visualization)

### Backend & Services
- Firebase
  - Authentication
  - Firestore (Database)
  - Storage (File storage)
  - Cloud Functions (Serverless backend)
- Firebase Emulators (Local development)

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── coach/           # Coach-specific components
│   ├── client/          # Client-specific components
│   ├── layout/          # Layout components
│   └── shared/          # Shared components
├── context/             # React context providers
├── pages/               # Application pages
│   ├── auth/           # Authentication pages
│   ├── coach/          # Coach pages
│   └── client/         # Client pages
├── services/           # Firebase service integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── config/             # Configuration files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: v18.17.0 or later)
- npm (v9+) or yarn (v1.22+)
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CheckinApp
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Create environment files:
   
   Create `.env.development`:
   ```
   VITE_FIREBASE_API_KEY=your-dev-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-dev-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-dev-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-dev-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-dev-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-dev-app-id
   VITE_USE_EMULATOR=true
   ```

4. Start Firebase emulators:
   ```bash
   firebase emulators:start
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

6. Access the application:
   - Main app: http://localhost:5173
   - Firebase Emulator UI: http://localhost:4000

## 🔒 Security

The application implements several security measures:

### Firebase Security Rules
- Authentication required for all operations
- Role-based access control
- Data validation
- User data isolation

### Best Practices
- Environment variables for sensitive data
- Input validation
- Error handling
- Secure file upload

## 🎨 Design System

### Colors
- Primary: `#daa450` (Brand color)
- Background: Light mode - `gray.50`, Dark mode - `gray.900`
- Text: Light mode - `gray.800`, Dark mode - `gray.100`
- Accent colors:
  - Success: `green.500`
  - Warning: `yellow.500`
  - Error: `red.500`
  - Info: `blue.500`

### Typography
- Font: Inter
- Sizes:
  - Headings: 2xl to 4xl
  - Body: md
  - Small text: sm

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints:
  - sm: 30em
  - md: 48em
  - lg: 62em
  - xl: 80em

## 🚀 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## 🔧 Troubleshooting

### Common Issues and Solutions

1. Port Already in Use
   ```bash
   sudo lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
   ```

2. Firebase Emulator Connection Issues
   ```bash
   firebase emulators:start --clear-data
   ```

3. Build/Dependency Issues
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

## 📈 Future Enhancements

- Advanced analytics dashboard
- Mobile application
- Integration with fitness trackers
- AI-powered recommendations
- Email notifications
- File attachment support
- Advanced data visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
