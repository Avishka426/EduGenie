import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Student logout confirmed');
              console.log('🔄 Current user before logout:', user);
              
              await logout();
              
              console.log('🚪 Student logged out successfully, redirecting to login');
              router.replace('/login');
            } catch (error) {
              console.error('❌ Logout error:', error);
              // Even if logout fails, redirect to login for safety
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>
                Welcome back{user?.name ? `, ${user.name}` : ''}!
              </Text>
              <Text style={styles.subtitle}>Ready to continue learning?</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Button
              title="Browse Courses"
              onPress={() => router.push('./courses')}
              size="medium"
              style={styles.actionButton}
            />
            <Button
              title="My Courses"
              onPress={() => router.push('./enrolled')}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
          </View>
          <Button
            title="🤖 Get AI Recommendations"
            onPress={() => console.log('AI Recommendations coming soon!')}
            variant="secondary"
            size="medium"
            style={{...styles.actionButton, backgroundColor: COLORS.SUCCESS}}
            textStyle={{ color: COLORS.WHITE }}
          />
        </Card>

        {/* Learning Progress */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Your Learning Progress</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Enrolled Courses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Hours Learned</Text>
            </View>
          </View>
        </Card>

        {/* Recent Courses */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Continue Learning</Text>
          <Text style={styles.emptyText}>
            No courses enrolled yet. Start by browsing available courses!
          </Text>
        </Card>

        {/* Recommended Courses */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Recommended for You</Text>
          <Text style={styles.emptyText}>
            Get personalized course recommendations using our AI assistant!
          </Text>
          <Button
            title="Get Recommendations"
            onPress={() => console.log('AI Recommendations coming soon!')}
            variant="secondary"
            size="small"
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
});
