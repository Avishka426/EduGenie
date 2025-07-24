import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import ApiService from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  content?: string;
  duration?: number | string;
  thumbnail?: string;
  instructor?: any;
  [key: string]: any;
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  lastAccessed?: string;
  [key: string]: any;
}

export default function CourseDetailsScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'students'>('details');

  const loadCourseData = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setError(null);
      console.log('🔄 Loading course details for:', courseId);
      
      // Load course details
      const courseResponse = await ApiService.getCourseDetails(courseId);
      console.log('📚 Course details response:', courseResponse);
      
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      } else {
        setError(courseResponse.error || 'Failed to load course details');
        Alert.alert('Error', courseResponse.error || 'Failed to load course details');
        return;
      }
      
      // Load enrolled students
      const studentsResponse = await ApiService.getCourseStudents(courseId);
      console.log('👥 Students response:', studentsResponse);
      
      if (studentsResponse.success) {
        // Handle different response formats
        let studentsData: Student[] = [];
        
        if (Array.isArray(studentsResponse.data)) {
          studentsData = studentsResponse.data;
        } else if (studentsResponse.data && Array.isArray(studentsResponse.data.students)) {
          studentsData = studentsResponse.data.students;
        } else if (studentsResponse.data && Array.isArray(studentsResponse.data.data)) {
          studentsData = studentsResponse.data.data;
        }
        
        setStudents(studentsData);
      } else {
        console.warn('⚠️ Failed to load students:', studentsResponse.error);
        // Don't show error for students as it might not be critical
      }

    } catch (error) {
      console.error('❌ Error loading course data:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
      Alert.alert('Error', 'Failed to load course data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [courseId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCourseData();
  }, [loadCourseData]);

  const handleEditCourse = () => {
    router.push(`./edit-course?courseId=${courseId}`);
  };

  const handleDeleteCourse = () => {
    if (!course) return;
    
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${course.title}"? This action cannot be undone and will affect all enrolled students.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await ApiService.deleteCourse(courseId);
              if (response.success) {
                Alert.alert('Success', 'Course deleted successfully', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                Alert.alert('Error', response.error || 'Failed to delete course');
              }
            } catch (error) {
              console.error('❌ Error deleting course:', error);
              Alert.alert('Error', 'Failed to delete course');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Course not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
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
            <Text style={styles.backButtonText}>← Back to Courses</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.category}>{course.category}</Text>
            {error && (
              <Text style={styles.errorText}>⚠️ {error}</Text>
            )}
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Edit Course"
              onPress={handleEditCourse}
              style={styles.editButton}
              size="medium"
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteCourse}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
              Course Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'students' && styles.activeTab]}
            onPress={() => setActiveTab('students')}
          >
            <Text style={[styles.tabText, activeTab === 'students' && styles.activeTabText]}>
              Students ({students.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <View>
            {/* Course Overview */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Course Overview</Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewValue}>${course.price}</Text>
                  <Text style={styles.overviewLabel}>Price</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewValue}>{course.enrollmentCount || 0}</Text>
                  <Text style={styles.overviewLabel}>Students</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewValue}>
                    {course.rating ? course.rating.toFixed(1) : 'N/A'}
                  </Text>
                  <Text style={styles.overviewLabel}>Rating</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewValue}>{course.level}</Text>
                  <Text style={styles.overviewLabel}>Level</Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[styles.statusValue, getStatusColor(course.status || 'draft')]}>
                  {course.status || 'draft'}
                </Text>
              </View>
            </Card>

            {/* Course Description */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Description</Text>
              <Text style={styles.description}>{course.description}</Text>
            </Card>

            {/* Course Content */}
            {course.content && (
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>Course Content</Text>
                <Text style={styles.content}>{course.content}</Text>
              </Card>
            )}

            {/* Additional Information */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Additional Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duration:</Text>
                <Text style={styles.infoValue}>{course.duration || 'Not specified'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created:</Text>
                <Text style={styles.infoValue}>
                  {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Unknown'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Course ID:</Text>
                <Text style={styles.infoValue}>{course.id}</Text>
              </View>
            </Card>
          </View>
        ) : (
          <View>
            {/* Students List */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Enrolled Students</Text>
              
              {students.length === 0 ? (
                <Text style={styles.emptyText}>No students enrolled yet</Text>
              ) : (
                <View>
                  {/* Table Header */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.nameColumn]}>Name</Text>
                    <Text style={[styles.tableHeaderText, styles.emailColumn]}>Email</Text>
                    <Text style={[styles.tableHeaderText, styles.dateColumn]}>Enrolled</Text>
                    <Text style={[styles.tableHeaderText, styles.progressColumn]}>Progress</Text>
                  </View>
                  
                  {/* Table Rows */}
                  {students.map((student) => (
                    <View key={student.id} style={styles.tableRow}>
                      <Text style={[styles.tableCellText, styles.nameColumn]} numberOfLines={1}>
                        {student.name}
                      </Text>
                      <Text style={[styles.tableCellText, styles.emailColumn]} numberOfLines={1}>
                        {student.email}
                      </Text>
                      <Text style={[styles.tableCellText, styles.dateColumn]}>
                        {new Date(student.enrolledAt).toLocaleDateString()}
                      </Text>
                      <Text style={[styles.tableCellText, styles.progressColumn]}>
                        {student.progress ? `${student.progress}%` : 'N/A'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>

            {/* Student Statistics */}
            {students.length > 0 && (
              <Card style={styles.card}>
                <Text style={styles.cardTitle}>Student Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{students.length}</Text>
                    <Text style={styles.statLabel}>Total Students</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {students.filter(s => s.progress && s.progress > 0).length}
                    </Text>
                    <Text style={styles.statLabel}>Active</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {students.filter(s => s.progress && s.progress >= 100).length}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {students.length > 0 
                        ? Math.round(students.reduce((sum, s) => sum + (s.progress || 0), 0) / students.length)
                        : 0}%
                    </Text>
                    <Text style={styles.statLabel}>Avg Progress</Text>
                  </View>
                </View>
              </Card>
            )}
          </View>
        )}

        {/* Debug Info */}
        {__DEV__ && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>🔧 Debug Info</Text>
            <Text style={styles.debugText}>Course ID: {courseId}</Text>
            <Text style={styles.debugText}>Students loaded: {students.length}</Text>
            <Text style={styles.debugText}>Active tab: {activeTab}</Text>
            <Button
              title="Test API Calls"
              onPress={async () => {
                try {
                  const courseRes = await ApiService.getCourseDetails(courseId);
                  const studentsRes = await ApiService.getCourseStudents(courseId);
                  Alert.alert(
                    'API Test Result',
                    `Course: ${courseRes.success ? 'Success' : 'Failed'}\nStudents: ${studentsRes.success ? 'Success' : 'Failed'}`
                  );
                } catch (err) {
                  Alert.alert('API Test Error', String(err));
                }
              }}
              variant="secondary"
              size="small"
              style={styles.debugButton}
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'published':
      return { color: COLORS.SUCCESS };
    case 'draft':
      return { color: COLORS.WARNING };
    case 'archived':
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
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginBottom: 16,
  },
  headerContent: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  deleteButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY_MEDIUM,
  },
  activeTabText: {
    color: COLORS.WHITE,
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overviewItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
  },
  statusLabel: {
    fontSize: 16,
    color: COLORS.GRAY_DARK,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: COLORS.GRAY_DARK,
    lineHeight: 24,
  },
  content: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    flex: 1,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  tableCellText: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
  },
  nameColumn: {
    flex: 2,
  },
  emailColumn: {
    flex: 2.5,
  },
  dateColumn: {
    flex: 1.5,
    textAlign: 'center',
  },
  progressColumn: {
    flex: 1,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  debugText: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 4,
  },
  debugButton: {
    marginTop: 8,
  },
});
