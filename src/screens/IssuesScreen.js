import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Card, Chip, Button, Searchbar, FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';

import { colors, spacing, shadows } from '../utils/theme';
import { apiService } from '../services/api';
import { showErrorToast, formatDate, getStatusColor, getStatusText } from '../utils/helpers';

const { width } = Dimensions.get('window');

const IssuesScreen = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, resolved, pending

  useFocusEffect(
    useCallback(() => {
      loadIssues();
    }, [])
  );

  useEffect(() => {
    filterIssues();
  }, [issues, searchQuery, filterStatus]);

  const loadIssues = async () => {
    try {
      const data = await apiService.getAllIssues();
      setIssues(data);
    } catch (error) {
      showErrorToast('Error', 'Failed to load issues');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    // Filter by status
    if (filterStatus === 'resolved') {
      filtered = filtered.filter(issue => issue.issue_resolved);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(issue => !issue.issue_resolved);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query)
      );
    }

    setFilteredIssues(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadIssues();
  };

  const FilterChip = ({ label, value, count }) => (
    <Chip
      selected={filterStatus === value}
      onPress={() => setFilterStatus(value)}
      style={[
        styles.filterChip,
        filterStatus === value && styles.selectedFilterChip
      ]}
      textStyle={[
        styles.filterChipText,
        filterStatus === value && styles.selectedFilterChipText
      ]}
    >
      {label} ({count})
    </Chip>
  );

  const IssueCard = ({ issue, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      style={styles.cardContainer}
    >
      <Card style={styles.issueCard}>
        <Card.Content>
          {/* Header with title and status */}
          <View style={styles.cardHeader}>
            <Text style={styles.issueTitle} numberOfLines={2}>
              {issue.title}
            </Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(issue.issue_resolved) }
            ]}>
              <Text style={styles.statusText}>
                {getStatusText(issue.issue_resolved)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.issueDescription} numberOfLines={3}>
            {issue.description}
          </Text>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {issue.location}
            </Text>
          </View>

          {/* Image if available */}
          {issue.image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: issue.image }} style={styles.issueImage} />
            </View>
          )}

          {/* Footer with date and actions */}
          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.dateText}>
                {formatDate(issue.createdAt)}
              </Text>
            </View>
            
            {!issue.issue_resolved && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleResolveIssue(issue._id)}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
                <Text style={styles.actionButtonText}>Mark Resolved</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  );

  const handleResolveIssue = async (issueId) => {
    try {
      await apiService.resolveIssue(issueId);
      loadIssues(); // Refresh the list
      showSuccessToast('Success', 'Issue marked as resolved');
    } catch (error) {
      showErrorToast('Error', 'Failed to resolve issue');
    }
  };

  const EmptyState = () => (
    <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={64} color={colors.gray[400]} />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No matching issues found' : 'No issues reported yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search or filter criteria'
          : 'Be the first to report a civic issue in your community'
        }
      </Text>
      {!searchQuery && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Report')}
          style={styles.emptyButton}
        >
          Report First Issue
        </Button>
      )}
    </Animatable.View>
  );

  const resolvedCount = issues.filter(issue => issue.issue_resolved).length;
  const pendingCount = issues.filter(issue => !issue.issue_resolved).length;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Animatable.View animation="fadeInDown" style={styles.searchContainer}>
        <Searchbar
          placeholder="Search issues..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={colors.primary}
        />
      </Animatable.View>

      {/* Filter Chips */}
      <Animatable.View animation="fadeInLeft" delay={200} style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterChip label="All" value="all" count={issues.length} />
          <FilterChip label="Pending" value="pending" count={pendingCount} />
          <FilterChip label="Resolved" value="resolved" count={resolvedCount} />
        </ScrollView>
      </Animatable.View>

      {/* Issues List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredIssues.length > 0 ? (
          <View style={styles.issuesContainer}>
            {filteredIssues.map((issue, index) => (
              <IssueCard key={issue._id} issue={issue} index={index} />
            ))}
          </View>
        ) : (
          <EmptyState />
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Report')}
        color={colors.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 12,
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterChip: {
    marginRight: spacing.sm,
    backgroundColor: colors.gray[100],
  },
  selectedFilterChip: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    color: colors.textSecondary,
  },
  selectedFilterChipText: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  issuesContainer: {
    paddingHorizontal: spacing.lg,
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
  issueCard: {
    borderRadius: 12,
    ...shadows.sm,
  },
  cardHeader: {
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
  issueDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  imageContainer: {
    marginBottom: spacing.sm,
  },
  issueImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.green[50],
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    borderRadius: 8,
  },
  bottomSpacing: {
    height: 80, // Space for FAB
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default IssuesScreen;
