import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Card, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

import { colors, spacing, shadows } from '../utils/theme';
import { imageService } from '../services/imageService';
import { locationService } from '../services/locationService';
import { apiService } from '../services/api';
import { showErrorToast, showSuccessToast } from '../utils/helpers';

const ReportScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      const address = await locationService.reverseGeocode(location.latitude, location.longitude);
      setFormData(prev => ({ ...prev, location: address }));
    } catch (error) {
      console.log('Location error:', error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationChange = async (text) => {
    setFormData(prev => ({ ...prev, location: text }));
    
    if (text.length >= 3) {
      try {
        const suggestions = await locationService.searchLocations(text);
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.log('Location search error:', error);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectLocationSuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, location: suggestion.formatted }));
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const takePhoto = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await imageService.takePhoto();
      if (result) {
        setImage(result);
        showSuccessToast('Success', 'Photo captured successfully');
      }
    } catch (error) {
      showErrorToast('Error', error.message);
    }
  };

  const pickImage = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await imageService.pickImage();
      if (result) {
        setImage(result);
        showSuccessToast('Success', 'Image selected successfully');
      }
    } catch (error) {
      showErrorToast('Error', error.message);
    }
  };

  const removeImage = () => {
    setImage(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      showErrorToast('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('location', formData.location.trim());

      if (image) {
        submitData.append('image', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });
      }

      const response = await apiService.submitIssue(submitData);
      
      showSuccessToast('Success', 'Issue reported successfully!');
      
      // Reset form
      setFormData({ title: '', description: '', location: '' });
      setImage(null);
      
      // Navigate to Issues screen
      navigation.navigate('Issues');
      
    } catch (error) {
      showErrorToast('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const ImagePickerButton = ({ icon, title, onPress, color }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        style={styles.imageButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={24} color={colors.white} />
        <Text style={styles.imageButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.headerTitle}>Report a Civic Issue</Text>
          <Text style={styles.headerSubtitle}>Help make your community better</Text>
        </Animatable.View>

        <View style={styles.formContainer}>
          {/* Title Field */}
          <Animatable.View animation="fadeInUp" delay={200}>
            <Card style={styles.inputCard}>
              <Card.Content>
                <View style={styles.inputHeader}>
                  <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                  <Text style={styles.inputLabel}>Issue Title *</Text>
                </View>
                <TextInput
                  mode="outlined"
                  placeholder="e.g., Broken street light, Pothole, Garbage not collected"
                  value={formData.title}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                  style={styles.textInput}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                />
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* Description Field */}
          <Animatable.View animation="fadeInUp" delay={300}>
            <Card style={styles.inputCard}>
              <Card.Content>
                <View style={styles.inputHeader}>
                  <Ionicons name="chatbox-outline" size={20} color={colors.primary} />
                  <Text style={styles.inputLabel}>Description *</Text>
                </View>
                <TextInput
                  mode="outlined"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  multiline
                  numberOfLines={4}
                  style={styles.textInput}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                />
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* Location Field */}
          <Animatable.View animation="fadeInUp" delay={400}>
            <Card style={styles.inputCard}>
              <Card.Content>
                <View style={styles.inputHeader}>
                  <Ionicons name="location-outline" size={20} color={colors.primary} />
                  <Text style={styles.inputLabel}>Location *</Text>
                  {locationLoading && (
                    <ActivityIndicator size="small" color={colors.primary} />
                  )}
                </View>
                <TextInput
                  mode="outlined"
                  placeholder="Enter or search location..."
                  value={formData.location}
                  onChangeText={handleLocationChange}
                  onFocus={() => formData.location.length >= 3 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  style={styles.textInput}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  right={
                    <TextInput.Icon 
                      icon="crosshairs-gps" 
                      onPress={getCurrentLocation}
                      iconColor={colors.primary}
                    />
                  }
                />
                
                {/* Location Suggestions */}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {locationSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={suggestion.id}
                        onPress={() => selectLocationSuggestion(suggestion)}
                        style={styles.suggestionItem}
                      >
                        <Ionicons name="location-outline" size={16} color={colors.primary} />
                        <View style={styles.suggestionText}>
                          <Text style={styles.suggestionTitle}>{suggestion.formatted}</Text>
                          <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                            {suggestion.displayName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* Image Section */}
          <Animatable.View animation="fadeInUp" delay={500}>
            <Card style={styles.inputCard}>
              <Card.Content>
                <View style={styles.inputHeader}>
                  <Ionicons name="camera-outline" size={20} color={colors.primary} />
                  <Text style={styles.inputLabel}>Photo Evidence</Text>
                  <Text style={styles.optionalText}>(Optional)</Text>
                </View>

                {!image ? (
                  <View style={styles.imagePickerContainer}>
                    <ImagePickerButton
                      icon="camera-outline"
                      title="Take Photo"
                      onPress={takePhoto}
                      color={colors.primary}
                    />
                    <ImagePickerButton
                      icon="images-outline"
                      title="Choose Photo"
                      onPress={pickImage}
                      color={colors.secondary}
                    />
                  </View>
                ) : (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                    <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                      <Ionicons name="close-circle" size={24} color={colors.error} />
                    </TouchableOpacity>
                    <View style={styles.imageInfo}>
                      <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                      <Text style={styles.imageInfoText}>Photo attached</Text>
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* Submit Button */}
          <Animatable.View animation="fadeInUp" delay={600} style={styles.submitContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
              labelStyle={styles.submitButtonLabel}
            >
              {loading ? 'Submitting...' : 'Submit Issue Report'}
            </Button>
          </Animatable.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  formContainer: {
    padding: spacing.lg,
  },
  inputCard: {
    marginBottom: spacing.lg,
    borderRadius: 12,
    ...shadows.sm,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  optionalText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: colors.white,
  },
  suggestionsContainer: {
    marginTop: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    ...shadows.sm,
  },
  imageButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  imagePreviewContainer: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  imageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.green[50],
    borderRadius: 8,
  },
  imageInfoText: {
    marginLeft: spacing.xs,
    color: colors.success,
    fontWeight: '500',
  },
  submitContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  submitButton: {
    borderRadius: 12,
    ...shadows.md,
  },
  submitButtonContent: {
    paddingVertical: spacing.sm,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportScreen;
