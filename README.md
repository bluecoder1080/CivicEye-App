# 🏙️ CivicEye - React Native App

A beautiful, feature-rich React Native mobile application for reporting and tracking civic issues in your community. Built with Expo for seamless deployment and testing.

## ✨ Features

### 📱 **Mobile-First Design**
- **Beautiful UI**: Modern, intuitive interface with smooth animations
- **Cross-Platform**: Works on both iOS and Android
- **Expo Go Compatible**: Test instantly on your device
- **Responsive**: Adapts to all screen sizes

### 📸 **Smart Image Handling**
- **Camera Integration**: Take photos directly from device camera
- **Gallery Access**: Select existing photos from device gallery
- **Cloud Storage**: Images uploaded to Cloudinary with auto-optimization
- **Image Validation**: Automatic size and format validation

### 📍 **Advanced Location Services**
- **GPS Auto-Detection**: Automatic location detection with high accuracy
- **Address Suggestions**: Smart location autocomplete with OpenStreetMap
- **Manual Override**: Option to manually enter or correct location
- **Reverse Geocoding**: Convert coordinates to readable addresses

### 🎨 **Modern Features**
- **Real-time Updates**: Live status updates and progress indicators
- **Haptic Feedback**: Enhanced user experience with tactile feedback
- **Toast Notifications**: Beautiful success/error messages
- **Pull-to-Refresh**: Intuitive data refreshing
- **Search & Filter**: Find issues quickly with advanced filtering

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device
- Backend server running (see backend setup)

### Installation

1. **Navigate to the React Native app directory**
   ```bash
   cd CivicEye-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   
   Update `config.js` with your actual credentials:
   ```javascript
   export const CONFIG = {
     API_BASE_URL: 'http://YOUR_IP:5000/api', // Replace with your backend URL
     CLOUDINARY: {
       CLOUD_NAME: 'your_actual_cloud_name',
       API_KEY: 'your_actual_api_key',
       API_SECRET: 'your_actual_api_secret',
       UPLOAD_PRESET: 'civic_eye_uploads'
     }
   };
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Test on your device**
   - Install Expo Go from App Store/Play Store
   - Scan the QR code from the terminal
   - The app will load on your device

## 📱 App Structure

```
CivicEye-App/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Main app screens
│   │   ├── HomeScreen.js   # Dashboard with stats
│   │   ├── ReportScreen.js # Issue reporting form
│   │   ├── IssuesScreen.js # Issues list and management
│   │   └── ProfileScreen.js # User profile and settings
│   ├── services/           # API and external services
│   │   ├── api.js          # Backend API integration
│   │   ├── imageService.js # Camera and gallery handling
│   │   ├── locationService.js # GPS and geocoding
│   │   └── speechService.js # Text-to-speech functionality
│   ├── utils/              # Helper functions and utilities
│   │   ├── theme.js        # App theme and styling
│   │   └── helpers.js      # Utility functions
│   └── navigation/         # Navigation configuration
├── assets/                 # Images, fonts, and static assets
├── config.js              # App configuration
├── App.js                 # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Screens Overview

### 🏠 **Home Screen**
- Dashboard with issue statistics
- Recent issues overview
- Quick action buttons
- Beautiful gradient header

### 📝 **Report Screen**
- Issue reporting form with validation
- Camera integration for photo capture
- Location auto-detection and search
- Smooth animations and haptic feedback

### 📋 **Issues Screen**
- List of all reported issues
- Search and filter functionality
- Status management (resolve issues)
- Pull-to-refresh support

### 👤 **Profile Screen**
- User statistics and impact
- App settings and preferences
- Connection testing tools
- About information

## 🔧 Configuration

### Backend Connection

Update the API base URL in `config.js`:

```javascript
// For Android Emulator
API_BASE_URL: 'http://10.0.2.2:5000/api'

// For iOS Simulator
API_BASE_URL: 'http://localhost:5000/api'

// For Physical Device (replace with your computer's IP)
API_BASE_URL: 'http://192.168.1.XXX:5000/api'
```

### Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Get your credentials from the dashboard
3. Create an upload preset named `civic_eye_uploads`
4. Update the config with your actual credentials

## 📱 Testing on Device

### Using Expo Go

1. Install Expo Go on your mobile device
2. Make sure your device and computer are on the same network
3. Run `npx expo start`
4. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Network Configuration

If you're testing on a physical device, ensure:
- Your device and computer are on the same WiFi network
- Your backend server is accessible from your device
- Update the API_BASE_URL with your computer's IP address

## 🚀 Building for Production

### Create Standalone Builds

```bash
# Build for Android
npx eas build --platform android

# Build for iOS
npx eas build --platform ios

# Build for both platforms
npx eas build --platform all
```

### Publishing Updates

```bash
# Publish over-the-air update
npx expo publish
```

## 🔒 Security Notes

- Never commit actual API keys or credentials
- Use environment variables for sensitive data
- Implement proper authentication in production
- Validate all user inputs on the backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ using React Native and Expo
- Icons by Ionicons
- UI components by React Native Paper
- Animations by React Native Animatable
- Image handling by Expo Image Picker
- Location services by Expo Location

---

<div align="center">

**Made with ❤️ by [bluecoder1080](https://github.com/bluecoder1080)**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
