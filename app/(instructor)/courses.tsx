import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
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
  TouchableOpacity,
  View,
} from 'react-native';

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
  // Add optional fields that might come from backend
  content?: string;
  duration?: number | string;
  thumbnail?: string;
  instructor?: any;
  [key: string]: any; // Allow additional fields
}

export default function InstructorCoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCourses = useCallback(async () => {
    try {
      // Check authentication status
      const isAuth = await ApiService.isAuthenticated();
      
      if (!isAuth) {
        Alert.alert(
          'Authentication Required', 
          'Please log in to view your courses.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
        return;
      }
      
      const response = await ApiService.getInstructorCourses();
      
      if (response.success) {
        // Handle different response formats from backend
        let coursesData: Course[] = [];
        
        if (Array.isArray(response.data)) {
          coursesData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // If backend sends an object with a courses property
          if (Array.isArray(response.data.courses)) {
            coursesData = response.data.courses;
          } else if (Array.isArray(response.data.data)) {
            coursesData = response.data.data;
          } else {
            // If it's a single course object, wrap it in an array
            coursesData = [response.data];
          }
        } else {
          coursesData = [];
        }
        
        setCourses(coursesData);
      } else {
        
        // More specific error handling
        if (response.error?.includes('Access denied') || response.error?.includes('token')) {
          Alert.alert(
            'Authentication Error', 
            'Please log in again to view your courses.',
            [
              { text: 'OK', onPress: () => router.replace('/login') }
            ]
          );
        } else if (response.error?.includes('Network') || response.error?.includes('connect')) {
          Alert.alert(
            'Connection Error', 
            'Cannot connect to server. Please check your internet connection and try again.',
            [
              { text: 'Retry', onPress: () => loadCourses() },
              { text: 'Cancel' }
            ]
          );
        } else {
          Alert.alert('Error', response.error || 'Failed to load your courses');
        }
      }
    } catch {
      Alert.alert(
        'Unexpected Error', 
        'An unexpected error occurred. Please try again.',
        [
          { text: 'Retry', onPress: () => loadCourses() },
          { text: 'Cancel' }
        ]
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  const handleDeleteCourse = (course: Course) => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await ApiService.deleteCourse(course.id);
              if (response.success) {
                Alert.alert('Success', 'Course deleted successfully');
                loadCourses(); // Refresh the list
              } else {
                Alert.alert('Error', response.error || 'Failed to delete course');
              }
            } catch {
              Alert.alert('Error', 'Failed to delete course');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading your courses...</Text>
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>My Courses</Text>
          <Text style={styles.subtitle}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} created
          </Text>
        </View>

        {/* Create Course Button */}
        <View style={styles.actionsRow}>
          <Button
            title="+ Create New Course"
            onPress={() => router.push('./create')}
            style={styles.createButton}
          />
          <Button
            title="🔄 Refresh"
            onPress={() => {
              loadCourses();
            }}
            variant="secondary"
            size="medium"
            style={styles.refreshButton}
          />
        </View>

        {/* Courses List */}
        {courses.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptyText}>
              Start creating courses to share your knowledge with students worldwide!
            </Text>
            <Button
              title="Create Your First Course"
              onPress={() => router.push('./create')}
              style={styles.emptyButton}
            />
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseCategory}>{course.category}</Text>
                </View>
                <View style={styles.coursePrice}>
                  <Text style={styles.priceText}>${course.price}</Text>
                </View>
              </View>

              <Text style={styles.courseDescription} numberOfLines={2}>
                {course.description}
              </Text>

              <View style={styles.courseStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{course.enrollmentCount || 0}</Text>
                  <Text style={styles.statLabel}>Students</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {(course.rating && course.rating > 0) ? course.rating.toFixed(1) : 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{course.level}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, getStatusColor(course.status || 'draft')]}>
                    {course.status || 'draft'}
                  </Text>
                  <Text style={styles.statLabel}>Status</Text>
                </View>
              </View>

              <View style={styles.courseActions}>
                <Button
                  title="View Details"
                  onPress={() => router.push(`./course-details?courseId=${course.id}`)}
                  variant="secondary"
                  size="small"
                  style={styles.actionButton}
                />
                <Button
                  title="Edit"
                  onPress={() => router.push(`./edit-course?courseId=${course.id}`)}
                  variant="secondary"
                  size="small"
                  style={styles.actionButton}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCourse(course)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'Published':
      return { color: COLORS.SUCCESS };
    case 'Draft':
      return { color: COLORS.WARNING };
    case 'Archived':
      return { color: COLORS.GRAY_MEDIUM };
    default:
      return { color: COLORS.GRAY_DARK };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
  },
  createButton: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 16,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyButton: {
    width: 200,
  },
  courseCard: {
    marginBottom: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  courseCategory: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  coursePrice: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  courseDescription: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    lineHeight: 20,
    marginBottom: 16,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  courseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  refreshButton: {
    flex: 0.3,
  },
});
