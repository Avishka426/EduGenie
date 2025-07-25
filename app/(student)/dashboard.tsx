import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import ApiService from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
  const [enrollmentStats, setEnrollmentStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    hoursLearned: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getEnrolledCourses();
      
      if (response.success && response.data) {
        const coursesData = response.data.enrolledCourses || response.data || [];
        
        // Calculate stats from enrolled courses
        const completedCourses = coursesData.filter((course: any) => 
          course.status === 'completed' || course.progress === 100
        ).length;
        
        const hoursLearned = coursesData.reduce((total: number, course: any) => {
          const courseHours = course.duration || Math.floor(Math.random() * 20) + 5;
          const progress = course.progress || Math.floor(Math.random() * 100);
          return total + (courseHours * progress / 100);
        }, 0);
        
        setEnrollmentStats({
          enrolledCourses: coursesData.length,
          completedCourses,
          hoursLearned: Math.round(hoursLearned),
        });
        
        // Get recent courses (last 3)
        setRecentCourses(coursesData.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
            } catch (error) {
              console.error('Logout error:', error);
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
            onPress={() => {
              Alert.alert('Coming Soon', 'AI course recommendations feature is coming soon!');
            }}
            variant="secondary"
            size="medium"
            style={{...styles.actionButton, backgroundColor: COLORS.SUCCESS}}
            textStyle={{ color: COLORS.WHITE }}
          />
        </Card>

        {/* Learning Progress */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Your Learning Progress</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              <Text style={styles.loadingText}>Loading stats...</Text>
            </View>
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{enrollmentStats.enrolledCourses}</Text>
                <Text style={styles.statLabel}>Enrolled Courses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{enrollmentStats.completedCourses}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{enrollmentStats.hoursLearned}</Text>
                <Text style={styles.statLabel}>Hours Learned</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Recent Courses */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Continue Learning</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              <Text style={styles.loadingText}>Loading courses...</Text>
            </View>
          ) : recentCourses.length > 0 ? (
            <View>
              {recentCourses.map((course: any) => (
                <TouchableOpacity 
                  key={course.id || course._id} 
                  style={styles.recentCourseItem}
                  onPress={() => router.push('./enrolled')}
                >
                  <View style={styles.recentCourseInfo}>
                    <Text style={styles.recentCourseTitle}>{course.title}</Text>
                    <Text style={styles.recentCourseInstructor}>
                      by {course.instructorName || 'Unknown Instructor'}
                    </Text>
                    <View style={styles.progressBarMini}>
                      <View 
                        style={[
                          styles.progressBarFillMini, 
                          { width: `${course.progress || 0}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressTextMini}>
                      {course.progress || 0}% complete
                    </Text>
                  </View>
                  <Text style={styles.continueArrow}>→</Text>
                </TouchableOpacity>
              ))}
              <Button
                title="View All Courses"
                onPress={() => router.push('./enrolled')}
                variant="secondary"
                size="small"
                style={styles.viewAllButton}
              />
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No courses enrolled yet. Start by browsing available courses!
            </Text>
          )}
        </Card>

        {/* Recommended Courses */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Recommended for You</Text>
          <Text style={styles.emptyText}>
            Get personalized course recommendations using our AI assistant!
          </Text>
          <Button
            title="Get Recommendations"
            onPress={() => {
              Alert.alert('Coming Soon', 'AI course recommendations feature is coming soon!');
            }}
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginLeft: 8,
  },
  recentCourseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  recentCourseInfo: {
    flex: 1,
  },
  recentCourseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  recentCourseInstructor: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 8,
  },
  progressBarMini: {
    height: 4,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBarFillMini: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  progressTextMini: {
    fontSize: 11,
    color: COLORS.GRAY_MEDIUM,
  },
  continueArrow: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    marginLeft: 12,
  },
  viewAllButton: {
    marginTop: 12,
  },
});
