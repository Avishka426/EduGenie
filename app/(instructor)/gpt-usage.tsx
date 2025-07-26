import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import GPTService, { GPTUsageResponse } from '@/services/gptService';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function GPTUsageScreen() {
  const [usage, setUsage] = useState<GPTUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsageData = async () => {
    try {
      const response = await GPTService.getAPIUsage();

      if (response.success && response.data) {
        setUsage(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to load usage statistics');
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
      Alert.alert('Error', 'Failed to load usage statistics');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsageData();
  };

  useEffect(() => {
    loadUsageData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading usage statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 GPT API Usage Statistics</Text>
          <Text style={styles.subtitle}>
            Monitor AI recommendation system usage and performance
          </Text>
        </View>

        {usage && (
          <>
            {/* Usage Overview */}
            <Card style={styles.overviewCard}>
              <Text style={styles.cardTitle}>API Usage Overview</Text>
              
              <View style={styles.usageStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{usage.usage.callsUsed}</Text>
                  <Text style={styles.statLabel}>Calls Used</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{usage.usage.remainingCalls}</Text>
                  <Text style={styles.statLabel}>Remaining</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{usage.usage.maxCalls}</Text>
                  <Text style={styles.statLabel}>Total Limit</Text>
                </View>
              </View>

              {/* Usage Bar */}
              <View style={styles.usageBarContainer}>
                <Text style={styles.usagePercentageText}>
                  {usage.usage.usagePercentage}% of quota used
                </Text>
                <View style={styles.usageBar}>
                  <View 
                    style={[
                      styles.usageBarFill, 
                      { 
                        width: `${usage.usage.usagePercentage}%`,
                        backgroundColor: usage.usage.usagePercentage > 80 
                          ? COLORS.ERROR 
                          : usage.usage.usagePercentage > 60 
                            ? COLORS.WARNING 
                            : COLORS.SUCCESS
                      }
                    ]} 
                  />
                </View>
              </View>

              {/* Warning if usage is high */}
              {usage.warning && (
                <View style={styles.warningContainer}>
                  <Text style={styles.warningText}>⚠️ {usage.warning}</Text>
                </View>
              )}
            </Card>

            {/* Usage Details */}
            <Card style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Usage Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total API Calls Made:</Text>
                <Text style={styles.detailValue}>{usage.usage.callsUsed}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Remaining Calls:</Text>
                <Text style={styles.detailValue}>{usage.usage.remainingCalls}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Daily Limit:</Text>
                <Text style={styles.detailValue}>{usage.usage.maxCalls}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Usage Percentage:</Text>
                <Text style={[
                  styles.detailValue,
                  { 
                    color: usage.usage.usagePercentage > 80 
                      ? COLORS.ERROR 
                      : usage.usage.usagePercentage > 60 
                        ? COLORS.WARNING 
                        : COLORS.SUCCESS
                  }
                ]}>
                  {usage.usage.usagePercentage}%
                </Text>
              </View>
            </Card>

            {/* Status Card */}
            <Card style={styles.statusCard}>
              <Text style={styles.cardTitle}>System Status</Text>
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>AI Recommendations:</Text>
                <Text style={[
                  styles.statusValue,
                  { color: usage.usage.remainingCalls > 0 ? COLORS.SUCCESS : COLORS.ERROR }
                ]}>
                  {usage.usage.remainingCalls > 0 ? '✅ Available' : '❌ Unavailable'}
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Fallback System:</Text>
                <Text style={[styles.statusValue, { color: COLORS.SUCCESS }]}>
                  ✅ Active
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Popular Courses:</Text>
                <Text style={[styles.statusValue, { color: COLORS.SUCCESS }]}>
                  ✅ Available
                </Text>
              </View>
            </Card>

            {/* Recommendations */}
            <Card style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>💡 Optimization Tips</Text>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>
                  • Monitor usage regularly to avoid hitting the limit
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>
                  • Encourage students to be specific in their prompts for better results
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>
                  • The fallback system ensures continuous service availability
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipText}>
                  • Popular courses are always available as recommendations
                </Text>
              </View>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                title="🔄 Refresh Data"
                onPress={onRefresh}
                variant="secondary"
                style={styles.refreshButton}
              />
              
              <Button
                title="📚 View Popular Courses"
                onPress={() => {
                  Alert.alert(
                    'Popular Courses',
                    'This will show the current popular courses that serve as fallback recommendations.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'View', onPress: () => console.log('Show popular courses') }
                    ]
                  );
                }}
                style={styles.popularButton}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    marginTop: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
  },
  overviewCard: {
    marginBottom: 20,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    fontWeight: '600',
  },
  usageBarContainer: {
    marginBottom: 16,
  },
  usagePercentageText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: 8,
  },
  usageBar: {
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: 4,
  },
  usageBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  warningContainer: {
    backgroundColor: COLORS.WARNING,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  detailsCard: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  statusCard: {
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationsCard: {
    marginBottom: 20,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  refreshButton: {
    flex: 1,
  },
  popularButton: {
    flex: 1,
  },
});
