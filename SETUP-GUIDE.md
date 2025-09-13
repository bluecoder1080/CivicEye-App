# 🚀 CivicEye App Setup Guide

## Quick Start for Judges/Demo

### 1. Install Expo Go on Your Device
- **iOS**: Download from App Store
- **Android**: Download from Google Play Store

### 2. Scan QR Code
The app is now running! Scan the QR code displayed in the terminal with:
- **iOS**: Use the Camera app to scan the QR code
- **Android**: Use the Expo Go app to scan the QR code

### 3. Backend Configuration
The app connects to your existing backend. Make sure your backend server is running:

```bash
# In the main project directory
cd backend
npm start
```

### 4. Update API Configuration
If testing on a physical device, update the API URL in `config.js`:

```javascript
// For physical device (replace with your computer's IP)
API_BASE_URL: 'http://192.168.1.XXX:5000/api'
```

To find your IP address:
- **Windows**: `ipconfig` (look for IPv4 Address)
- **Mac/Linux**: `ifconfig` (look for inet address)

## Features Available for Demo

### 📱 **Home Screen**
- Dashboard with issue statistics
- Recent issues overview
- Beautiful gradient design
- Quick action buttons

### 📝 **Report Issue**
- Camera integration (take photos)
- Gallery access (choose existing photos)
- GPS location detection
- Location search with suggestions
- Form validation with haptic feedback

### 📋 **Issues List**
- View all reported issues
- Search and filter functionality
- Mark issues as resolved
- Pull-to-refresh
- Beautiful card layout

### 👤 **Profile**
- User statistics
- App settings
- Connection testing
- About information

## Environment Setup

### Required Credentials
Update `config.js` with your actual credentials:

```javascript
export const CONFIG = {
  API_BASE_URL: 'http://YOUR_IP:5000/api',
  CLOUDINARY: {
    CLOUD_NAME: 'your_actual_cloud_name',
    API_KEY: 'your_actual_api_key', 
    API_SECRET: 'your_actual_api_secret',
    UPLOAD_PRESET: 'civic_eye_uploads'
  }
};
```

### Cloudinary Setup
1. Go to https://cloudinary.com/console
2. Create an upload preset named `civic_eye_uploads`
3. Set it to "Unsigned" for mobile uploads
4. Update the config with your credentials

## Testing Checklist

- [ ] App loads successfully in Expo Go
- [ ] Home screen displays with statistics
- [ ] Can navigate between tabs
- [ ] Camera works for taking photos
- [ ] Location detection works
- [ ] Can submit issues with photos
- [ ] Issues appear in the Issues tab
- [ ] Can mark issues as resolved
- [ ] Search and filter work
- [ ] Backend connection test works

## Troubleshooting

### Common Issues

**App won't load:**
- Ensure your device and computer are on the same WiFi network
- Check if the QR code is valid
- Restart the Expo development server

**Backend connection fails:**
- Make sure backend server is running on port 5000
- Update API_BASE_URL with correct IP address
- Check firewall settings

**Camera not working:**
- Grant camera permissions when prompted
- Ensure device has a working camera
- Try restarting the app

**Location not detected:**
- Grant location permissions when prompted
- Ensure location services are enabled
- Try manual location entry

## Demo Script

1. **Start with Home Screen**: Show dashboard and statistics
2. **Report an Issue**: 
   - Tap "Report Issue"
   - Take a photo of something
   - Show location auto-detection
   - Fill in title and description
   - Submit the issue
3. **View Issues**: 
   - Go to Issues tab
   - Show the newly created issue
   - Demonstrate search functionality
   - Mark an issue as resolved
4. **Profile**: Show user statistics and settings

## Performance Notes

- First load may take a few seconds
- Camera initialization needs permission
- Location detection requires GPS signal
- Image uploads depend on internet speed

---

**The app is now ready for demonstration! 🎉**
