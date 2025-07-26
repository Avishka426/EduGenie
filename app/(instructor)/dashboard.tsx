import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import ApiService from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
  newEnrollments: number;
  completionRate: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  level: string;
  enrollmentCount?: number;
  rating?: number;
  status?: string;
  createdAt?: string;
  [key: string]: any;
}

interface Activity {
  id: string;
  type: 'enrollment' | 'review' | 'completion';
  message: string;
  time: string;
  course?: string;
  student?: string;
}

export default function InstructorDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // State management
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0,
    newEnrollments: 0,
    completionRate: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      
      // Check authentication
      const isAuth = await ApiService.isAuthenticated();
      if (!isAuth) {
        setError('Not authenticated');
        router.replace('/login');
        return;
      }

      // Load courses data
      const coursesResponse = await ApiService.getInstructorCourses();
      
      if (coursesResponse.success) {
        // Handle different response formats from backend
        let coursesData: Course[] = [];
        
        if (Array.isArray(coursesResponse.data)) {
          coursesData = coursesResponse.data;
        } else if (coursesResponse.data && typeof coursesResponse.data === 'object') {
          if (Array.isArray(coursesResponse.data.courses)) {
            coursesData = coursesResponse.data.courses;
          } else if (Array.isArray(coursesResponse.data.data)) {
            coursesData = coursesResponse.data.data;
          } else {
            coursesData = [coursesResponse.data];
          }
        }

        setCourses(coursesData);

        // Calculate statistics from courses data
        const totalCourses = coursesData.length;
        const totalStudents = coursesData.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
        const totalRevenue = coursesData.reduce((sum, course) => sum + (course.price * (course.enrollmentCount || 0)), 0);
        const avgRating = coursesData.length > 0 
          ? coursesData.reduce((sum, course) => sum + (course.rating || 0), 0) / coursesData.length 
          : 0;

        setStats({
          totalCourses,
          totalStudents,
          totalRevenue,
          avgRating: Math.round(avgRating * 10) / 10,
          newEnrollments: 0, // This would need a separate API endpoint
          completionRate: 0, // This would need a separate API endpoint
        });

      } else {
        setError(coursesResponse.error || 'Failed to load courses');
      }

      // For now, set empty activities (would need separate API endpoint)
      setActivities([]);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
              await logout();
              router.replace('/login');
            } catch {
              // Even if logout fails, redirect to login for safety
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  // Get top performing courses (limit to 3)
  const topPerformingCourses = courses
    .sort((a: Course, b: Course) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
    .slice(0, 3)
    .map((course: Course, index: number) => ({
      id: course.id,
      title: course.title,
      students: course.enrollmentCount || 0,
      rating: course.rating || 0,
      revenue: (course.price || 0) * (course.enrollmentCount || 0),
    }));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>
                Welcome{user?.name ? `, ${user.name}` : ''} - Instructor Dashboard
              </Text>
              <Text style={styles.subtitle}>Manage your courses and track performance</Text>
              {error && (
                <Text style={styles.errorText}>⚠️ {error}</Text>
              )}
            </View>
            
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
              title="My Courses"
              onPress={() => router.push('./courses')}
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
          <Button
            title="🤖 GPT API Usage"
            onPress={() => router.push('./gpt-usage')}
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
              <Text style={styles.statNumber}>{stats.totalCourses}</Text>
              <Text style={styles.statLabel}>Total Courses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalStudents}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${stats.totalRevenue}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.avgRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.newEnrollments}</Text>
              <Text style={styles.statLabel}>New This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion Rate</Text>
            </View>
          </View>
        </Card>

        {/* Top Performing Courses */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Top Performing Courses</Text>
          {topPerformingCourses.length === 0 ? (
            <Text style={styles.emptyText}>No courses available yet</Text>
          ) : (
            topPerformingCourses.map((course: any, index: number) => (
              <View key={course.id} style={styles.courseItem}>
                <View style={styles.courseRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.courseStats}>
                    <Text style={styles.courseStat}>👥 {course.students} students</Text>
                    <Text style={styles.courseStat}>⭐ {course.rating.toFixed(1)}</Text>
                    <Text style={styles.courseStat}>💰 ${course.revenue}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* Recent Activity */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {activities.length === 0 ? (
            <Text style={styles.emptyText}>No recent activity</Text>
          ) : (
            activities.map((activity: Activity) => (
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
            ))
          )}
          <Button
            title="View All Activity"
            onPress={() => console.log('View all activity - coming soon')}
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
              <View style={[styles.progressFill, { width: `${(stats.newEnrollments / 50) * 100}%` }]} />
            </View>
            <Text style={styles.goalProgress}>{stats.newEnrollments}/50 ({Math.round((stats.newEnrollments / 50) * 100)}%)</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Revenue Target: $15,000</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(stats.totalRevenue / 15000) * 100}%` }]} />
            </View>
            <Text style={styles.goalProgress}>${stats.totalRevenue}/$15,000 ({Math.round((stats.totalRevenue / 15000) * 100)}%)</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
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
    paddingRight: 4, // Add padding to keep button in bounds
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    maxWidth: 80, // Limit button width
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
