import * as Speech from 'expo-speech';

export const speechService = {
  // Text-to-Speech functionality
  async speak(text, options = {}) {
    try {
      const defaultOptions = {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.75,
        ...options,
      };

      await Speech.speak(text, defaultOptions);
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  },

  async stop() {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  },

  async isSpeaking() {
    try {
      return await Speech.isSpeakingAsync();
    } catch (error) {
      console.error('Error checking if speaking:', error);
      return false;
    }
  },

  // Speech-to-Text functionality (Web Speech API for web, native for mobile)
  startSpeechRecognition(onResult, onError) {
    // Note: This is a placeholder for speech recognition
    // React Native doesn't have built-in speech recognition
    // You would need to use a library like @react-native-voice/voice
    // or implement platform-specific solutions
    
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript.trim()) {
          onResult(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        onError(event.error);
      };

      recognition.start();
      return recognition;
    } else {
      // For mobile apps, you would implement native speech recognition
      console.warn('Speech recognition not available on this platform');
      onError('Speech recognition not available');
      return null;
    }
  },

  stopSpeechRecognition(recognition) {
    if (recognition && recognition.stop) {
      recognition.stop();
    }
  }
};
