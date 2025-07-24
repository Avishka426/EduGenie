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

export default function InstructorDashboard() {
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
              console.log('🔄 Instructor logout confirmed');
              console.log('🔄 Current user before logout:', user);
              
              await logout();
              
              console.log('🚪 Instructor logged out successfully, redirecting to login');
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

  // Mock instructor data
  const instructorStats = {
    totalCourses: 5,
    totalStudents: 234,
    totalRevenue: 12450,
    avgRating: 4.8,
    newEnrollments: 23,
    completionRate: 78,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'enrollment',
      message: 'Sarah Johnson enrolled in "React Native Basics"',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'review',
      message: 'New 5-star review for "Advanced JavaScript"',
      time: '4 hours ago',
    },
    {
      id: '3',
      type: 'completion',
      message: 'Mike Davis completed "UI/UX Design Course"',
      time: '6 hours ago',
    },
  ];

  const topPerformingCourses = [
    {
      id: '1',
      title: 'React Native Complete Guide',
      students: 89,
      rating: 4.9,
      revenue: 4450,
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      students: 67,
      rating: 4.8,
      revenue: 3350,
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      students: 45,
      rating: 4.7,
      revenue: 2250,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>
                Welcome{user?.name ? `, ${user.name}` : ''} - Instructor Dashboard
              </Text>
              <Text style={styles.subtitle}>Manage your courses and track performance</Text>
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
              title="Create Course"
              onPress={() => router.push('./create')}
              size="medium"
              style={styles.actionButton}
            />
            <Button
              title="View Students"
              onPress={() => router.push('./students')}
              variant="secondary"
              size="medium"
              style={styles.actionButton}
            />
          </View>
          <Button
            title="📊 Analytics Dashboard"
            onPress={() => console.log('Analytics coming soon!')}
            variant="secondary"
            size="medium"
            style={styles.actionButton}
          />
        </Card>

        {/* Statistics Overview */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.totalCourses}</Text>
              <Text style={styles.statLabel}>Total Courses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.totalStudents}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${instructorStats.totalRevenue}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.avgRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.newEnrollments}</Text>
              <Text style={styles.statLabel}>New This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
          </View>
        </Card>

        {/* Top Performing Courses */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Top Performing Courses</Text>
          {topPerformingCourses.map((course, index) => (
            <View key={course.id} style={styles.courseItem}>
              <View style={styles.courseRank}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <View style={styles.courseStats}>
                  <Text style={styles.courseStat}>👥 {course.students} students</Text>
                  <Text style={styles.courseStat}>⭐ {course.rating}</Text>
                  <Text style={styles.courseStat}>💰 ${course.revenue}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Recent Activity */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>
                  {activity.type === 'enrollment' ? '🎓' : 
                   activity.type === 'review' ? '⭐' : '🏆'}
                </Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
          <Button
            title="View All Activity"
            onPress={() => console.log('View all activity')}
            variant="secondary"
            size="small"
            style={styles.viewAllButton}
          />
        </Card>

        {/* Monthly Goals */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Goals</Text>
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>New Students Target: 50</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '46%' }]} />
            </View>
            <Text style={styles.goalProgress}>23/50 (46%)</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Revenue Target: $15,000</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '83%' }]} />
            </View>
            <Text style={styles.goalProgress}>$12,450/$15,000 (83%)</Text>
          </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  courseRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
  },
  courseStat: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
  },
  goalProgress: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
});
