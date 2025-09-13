import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { CONFIG } from '../../config';

export const imageService = {
  async requestCameraPermission() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  },

  async requestMediaLibraryPermission() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  },

  async takePhoto() {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Camera permission denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: CONFIG.IMAGE.QUALITY,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw new Error('Failed to take photo');
    }
  },

  async pickImage() {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        throw new Error('Media library permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: CONFIG.IMAGE.QUALITY,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: `image_${Date.now()}.jpg`,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw new Error('Failed to pick image');
    }
  },

  async validateImage(imageUri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      
      if (!fileInfo.exists) {
        throw new Error('Image file does not exist');
      }

      if (fileInfo.size > CONFIG.IMAGE.MAX_SIZE) {
        throw new Error(`Image size (${Math.round(fileInfo.size / 1024 / 1024)}MB) exceeds maximum allowed size (${CONFIG.IMAGE.MAX_SIZE / 1024 / 1024}MB)`);
      }

      return true;
    } catch (error) {
      console.error('Error validating image:', error);
      throw error;
    }
  },

  async compressImage(imageUri) {
    try {
      // For now, we'll use the original image
      // In a production app, you might want to use expo-image-manipulator
      // to compress the image further if needed
      return imageUri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return imageUri;
    }
  },

  createFormData(imageData, additionalData = {}) {
    const formData = new FormData();
    
    // Add image if provided
    if (imageData) {
      formData.append('image', {
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.name,
      });
    }

    // Add additional form fields
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return formData;
  },

  async uploadToCloudinary(imageData) {
    try {
      // This is a placeholder for direct Cloudinary upload
      // In production, you might want to upload directly to Cloudinary
      // or use your backend API endpoint
      const formData = new FormData();
      formData.append('file', {
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.name,
      });
      formData.append('upload_preset', CONFIG.CLOUDINARY.UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload to Cloudinary');
      }

      const result = await response.json();
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
};
