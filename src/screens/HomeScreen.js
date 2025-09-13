import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Card, Button } from 'react-native-paper';

import { colors, spacing, shadows } from '../utils/theme';
import { apiService } from '../services/api';
import { showErrorToast, showSuccessToast, formatDate } from '../utils/helpers';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const issues = await apiService.getAllIssues();
      
      const resolved = issues.filter(issue => issue.issue_resolved).length;
      const pending = issues.filter(issue => !issue.issue_resolved).length;
      
      setStats({
        total: issues.length,
        resolved,
        pending,
      });
      
      // Get recent issues (last 5)
      setRecentIssues(issues.slice(0, 5));
      
    } catch (error) {
      showErrorToast('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <Animatable.View animation="fadeInUp" delay={300}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient
          colors={[color, `${color}CC`]}
          style={styles.statCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statCardContent}>
            <Ionicons name={icon} size={32} color={colors.white} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  const QuickActionButton = ({ title, icon, color, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.quickActionButton, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={colors.white} />
        <Text style={styles.quickActionText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const RecentIssueCard = ({ issue }) => (
    <Card style={styles.issueCard}>
      <Card.Content>
        <View style={styles.issueHeader}>
          <Text style={styles.issueTitle} numberOfLines={2}>
            {issue.title}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: issue.issue_resolved ? colors.success : colors.warning }
          ]}>
            <Text style={styles.statusText}>
              {issue.issue_resolved ? 'Resolved' : 'Pending'}
            </Text>
          </View>
        </View>
        <Text style={styles.issueLocation} numberOfLines={1}>
          📍 {issue.location}
        </Text>
        <Text style={styles.issueDate}>
          {formatDate(issue.createdAt)}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>🏙️ CivicEye</Text>
          <Text style={styles.tagline}>Making communities better, one report at a time</Text>
        </Animatable.View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Issues"
          value={stats.total}
          icon="list-outline"
          color={colors.blue[600]}
          onPress={() => navigation.navigate('Issues')}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon="checkmark-circle-outline"
          color={colors.green[600]}
          onPress={() => navigation.navigate('Issues')}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="time-outline"
          color={colors.yellow[600]}
          onPress={() => navigation.navigate('Issues')}
        />
      </View>

      {/* Quick Actions */}
      <Animatable.View animation="fadeInUp" delay={600} style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickActionButton
            title="Report Issue"
            icon="add-circle-outline"
            color={colors.primary}
            onPress={() => navigation.navigate('Report')}
          />
          <QuickActionButton
            title="View All Issues"
            icon="list-outline"
            color={colors.secondary}
            onPress={() => navigation.navigate('Issues')}
          />
        </View>
      </Animatable.View>

      {/* Recent Issues */}
      <Animatable.View animation="fadeInUp" delay={800} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Issues</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Issues')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentIssues.length > 0 ? (
          recentIssues.map((issue, index) => (
            <Animatable.View
              key={issue._id}
              animation="fadeInUp"
              delay={900 + (index * 100)}
            >
              <RecentIssueCard issue={issue} />
            </Animatable.View>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Ionicons name="document-outline" size={48} color={colors.gray[400]} />
              <Text style={styles.emptyText}>No issues reported yet</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Report')}
                style={styles.emptyButton}
              >
                Report First Issue
              </Button>
            </Card.Content>
          </Card>
        )}
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
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 16,
    ...shadows.md,
  },
  statCardContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: spacing.sm,
  },
  statTitle: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  quickActionText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: spacing.sm,
    fontSize: 14,
  },
  issueCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    ...shadows.sm,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  issueTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
  issueLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  issueDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyCard: {
    borderRadius: 12,
    ...shadows.sm,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    borderRadius: 8,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});

export default HomeScreen;
