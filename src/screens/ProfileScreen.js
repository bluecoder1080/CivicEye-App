import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Button, Switch, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

import { colors, spacing, shadows } from '../utils/theme';
import { apiService } from '../services/api';
import { showErrorToast, showSuccessToast } from '../utils/helpers';

const ProfileScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalReported: 0,
    resolved: 0,
    pending: 0,
  });
  const [settings, setSettings] = useState({
    notifications: true,
    locationServices: true,
    autoLocation: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const issues = await apiService.getAllIssues();
      const resolved = issues.filter(issue => issue.issue_resolved).length;
      const pending = issues.filter(issue => !issue.issue_resolved).length;
      
      setStats({
        totalReported: issues.length,
        resolved,
        pending,
      });
    } catch (error) {
      console.log('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const testConnection = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await apiService.healthCheck();
      showSuccessToast('Success', 'Backend connection is working!');
    } catch (error) {
      showErrorToast('Error', 'Backend connection failed');
    }
  };

  const testCloudinary = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await apiService.testCloudinaryConnection();
      showSuccessToast('Success', 'Cloudinary connection is working!');
    } catch (error) {
      showErrorToast('Error', 'Cloudinary connection failed');
    }
  };

  const showAbout = () => {
    Alert.alert(
      'About CivicEye',
      'CivicEye is a community-driven platform for reporting and tracking civic issues. Help make your community better by reporting problems and tracking their resolution.\n\nVersion 1.0.0\nBuilt with React Native & Expo',
      [{ text: 'OK' }]
    );
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.statCardText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );

  const SettingItem = ({ title, subtitle, icon, value, onValueChange, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          color={colors.primary}
        />
      )}
      {type === 'arrow' && (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </View>
  );

  const ActionButton = ({ title, icon, onPress, color = colors.primary }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionButton, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color={colors.white} />
        <Text style={styles.actionButtonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.white} />
          </View>
          <Text style={styles.userName}>CivicEye User</Text>
          <Text style={styles.userSubtitle}>Community Reporter</Text>
        </Animatable.View>
      </LinearGradient>

      {/* Stats Section */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <StatCard
          title="Issues Reported"
          value={stats.totalReported}
          icon="document-text-outline"
          color={colors.blue[600]}
        />
        <StatCard
          title="Issues Resolved"
          value={stats.resolved}
          icon="checkmark-circle-outline"
          color={colors.green[600]}
        />
        <StatCard
          title="Pending Issues"
          value={stats.pending}
          icon="time-outline"
          color={colors.yellow[600]}
        />
      </Animatable.View>

      {/* Settings Section */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Card style={styles.settingsCard}>
          <Card.Content>
            <SettingItem
              title="Push Notifications"
              subtitle="Get notified about issue updates"
              icon="notifications-outline"
              value={settings.notifications}
              onValueChange={(value) => handleSettingChange('notifications', value)}
            />
            <Divider style={styles.divider} />
            <SettingItem
              title="Location Services"
              subtitle="Allow location access for better reporting"
              icon="location-outline"
              value={settings.locationServices}
              onValueChange={(value) => handleSettingChange('locationServices', value)}
            />
            <Divider style={styles.divider} />
            <SettingItem
              title="Auto-detect Location"
              subtitle="Automatically fill location when reporting"
              icon="navigate-outline"
              value={settings.autoLocation}
              onValueChange={(value) => handleSettingChange('autoLocation', value)}
            />
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* Actions Section */}
      <Animatable.View animation="fadeInUp" delay={600} style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsContainer}>
          <ActionButton
            title="Test Backend Connection"
            icon="server-outline"
            onPress={testConnection}
            color={colors.blue[600]}
          />
          <ActionButton
            title="Test Cloudinary"
            icon="cloud-outline"
            onPress={testCloudinary}
            color={colors.green[600]}
          />
        </View>
      </Animatable.View>

      {/* App Info Section */}
      <Animatable.View animation="fadeInUp" delay={800} style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <Card style={styles.settingsCard}>
          <Card.Content>
            <TouchableOpacity onPress={showAbout}>
              <SettingItem
                title="About CivicEye"
                subtitle="Learn more about the app"
                icon="information-circle-outline"
                type="arrow"
              />
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <SettingItem
              title="Version"
              subtitle="1.0.0"
              icon="code-outline"
              type="text"
            />
            <Divider style={styles.divider} />
            <SettingItem
              title="Developer"
              subtitle="bluecoder1080"
              icon="person-outline"
              type="text"
            />
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  userSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  statCardText: {
    marginLeft: spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  settingsCard: {
    borderRadius: 12,
    ...shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    marginVertical: spacing.xs,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    ...shadows.sm,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.sm,
    fontSize: 16,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});

export default ProfileScreen;
