import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import ApiService from '@/services/api';
import React, { useEffect, useState } from 'react';
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

interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  progress?: number;
  lastAccessed?: string;
  status: 'active' | 'completed' | 'dropped';
}

interface CourseWithStudents {
  id: string;
  title: string;
  enrollmentCount: number;
  maxStudents?: number;
  students: EnrolledStudent[];
}

export default function StudentsScreen() {
  const [courses, setCourses] = useState<CourseWithStudents[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithStudents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInstructorCourses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInstructorCourses = async () => {
    try {
      const response = await ApiService.getInstructorCourses();
      
      if (response.success && response.data) {
        const coursesData = response.data.courses || response.data || [];
        setCourses(coursesData);
        
        // Auto-select first course if available
        if (coursesData.length > 0 && !selectedCourse) {
          loadCourseStudents(coursesData[0]);
        }
        
        console.log('📚 Loaded instructor courses:', coursesData.length);
      } else {
        console.error('Failed to load courses:', response.error);
        Alert.alert('Error', 'Failed to load courses');
      }
    } catch (error) {
      console.error('❌ Error loading courses:', error);
      Alert.alert('Error', 'Failed to load courses');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const loadCourseStudents = async (course: any) => {
    try {
      const response = await ApiService.getCourseStudents(course.id);
      
      if (response.success && response.data) {
        const studentsData = response.data.students || [];
        
        // Add mock progress data for demonstration
        const studentsWithProgress = studentsData.map((student: any) => ({
          ...student,
          progress: Math.floor(Math.random() * 100),
          lastAccessed: ['2 days ago', '1 week ago', '3 days ago', '1 day ago'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.8 ? 'completed' : Math.random() > 0.9 ? 'dropped' : 'active',
        }));
        
        setSelectedCourse({
          ...course,
          students: studentsWithProgress,
        });
        
        console.log('👥 Loaded course students:', studentsWithProgress.length);
      } else {
        console.error('Failed to load students:', response.error);
        // For demo purposes, show mock data if API fails
        setSelectedCourse({
          ...course,
          students: generateMockStudents(course.enrollmentCount || 5),
        });
      }
    } catch (error) {
      console.error('❌ Error loading students:', error);
      // Show mock data for demo
      setSelectedCourse({
        ...course,
        students: generateMockStudents(course.enrollmentCount || 5),
      });
    }
  };

  const generateMockStudents = (count: number): EnrolledStudent[] => {
    const mockNames = [
      'Sarah Johnson', 'Mike Davis', 'Emily Chen', 'Alex Rodriguez', 'Jessica Wilson',
      'David Brown', 'Lisa Garcia', 'Ryan Thompson', 'Amanda Lee', 'Kevin Martinez',
    ];
    
    return Array.from({ length: Math.min(count, mockNames.length) }, (_, index) => ({
      id: `student_${index + 1}`,
      name: mockNames[index],
      email: mockNames[index].toLowerCase().replace(' ', '.') + '@example.com',
      enrolledAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: Math.floor(Math.random() * 100),
      lastAccessed: ['2 days ago', '1 week ago', '3 days ago', '1 day ago'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.8 ? 'completed' : Math.random() > 0.9 ? 'dropped' : 'active',
    }));
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInstructorCourses();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return COLORS.SUCCESS;
      case 'dropped': return COLORS.ERROR;
      default: return COLORS.PRIMARY;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'dropped': return '❌';
      default: return '📚';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading students...</Text>
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
          <Text style={styles.title}>Student Management</Text>
          <Text style={styles.subtitle}>
            View and manage enrolled students across your courses
          </Text>
        </View>

        {/* Course Selection */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Select Course</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseChip,
                  selectedCourse?.id === course.id && styles.courseChipSelected
                ]}
                onPress={() => loadCourseStudents(course)}
              >
                <Text style={[
                  styles.courseChipText,
                  selectedCourse?.id === course.id && styles.courseChipTextSelected
                ]}>
                  {course.title}
                </Text>
                <Text style={[
                  styles.courseChipCount,
                  selectedCourse?.id === course.id && styles.courseChipCountSelected
                ]}>
                  {course.enrollmentCount} students
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        {/* Students Table */}
        {selectedCourse ? (
          <Card style={styles.card}>
            <View style={styles.tableHeader}>
              <Text style={styles.cardTitle}>
                {selectedCourse.title} - Enrolled Students
              </Text>
              <Text style={styles.tableSubtitle}>
                {selectedCourse.students.length} total students
                {selectedCourse.maxStudents && ` • ${selectedCourse.maxStudents} max capacity`}
              </Text>
            </View>

            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeaderText, styles.nameColumn]}>Student</Text>
              <Text style={[styles.tableHeaderText, styles.statusColumn]}>Status</Text>
              <Text style={[styles.tableHeaderText, styles.progressColumn]}>Progress</Text>
              <Text style={[styles.tableHeaderText, styles.dateColumn]}>Enrolled</Text>
            </View>

            {/* Students List */}
            {selectedCourse.students.map((student, index) => (
              <View key={student.id} style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowEven
              ]}>
                <View style={styles.nameColumn}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentEmail}>{student.email}</Text>
                </View>
                
                <View style={styles.statusColumn}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(student.status) }]}>
                    <Text style={styles.statusText}>
                      {getStatusIcon(student.status)} {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressColumn}>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${student.progress || 0}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{student.progress || 0}%</Text>
                  </View>
                  <Text style={styles.lastAccessed}>Last: {student.lastAccessed}</Text>
                </View>
                
                <View style={styles.dateColumn}>
                  <Text style={styles.enrollDate}>{formatDate(student.enrolledAt)}</Text>
                </View>
              </View>
            ))}

            {selectedCourse.students.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No students enrolled yet</Text>
                <Text style={styles.emptySubtext}>
                  Students will appear here once they enroll in this course
                </Text>
              </View>
            )}
          </Card>
        ) : (
          <Card style={styles.card}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Select a course to view students</Text>
              <Text style={styles.emptySubtext}>
                Choose a course from the list above to see enrolled students
              </Text>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        {selectedCourse && selectedCourse.students.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <Button
                title="📧 Message All Students"
                onPress={() => console.log('Message all students')}
                variant="secondary"
                size="medium"
                style={styles.actionButton}
              />
              <Button
                title="📊 Export Student Data"
                onPress={() => console.log('Export student data')}
                variant="secondary"
                size="medium"
                style={styles.actionButton}
              />
            </View>
            <Button
              title="📈 View Detailed Analytics"
              onPress={() => console.log('View analytics')}
              variant="secondary"
              size="medium"
              style={styles.fullWidthButton}
            />
          </Card>
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
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    marginTop: 8,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
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
  courseChip: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 120,
  },
  courseChipSelected: {
    backgroundColor: COLORS.PRIMARY,
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  courseChipTextSelected: {
    color: COLORS.WHITE,
  },
  courseChipCount: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  courseChipCountSelected: {
    color: COLORS.WHITE,
    opacity: 0.8,
  },
  tableHeader: {
    marginBottom: 16,
  },
  tableSubtitle: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  tableRowEven: {
    backgroundColor: COLORS.GRAY_LIGHT,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.GRAY_MEDIUM,
    textTransform: 'uppercase',
  },
  nameColumn: {
    flex: 2,
    marginRight: 8,
  },
  statusColumn: {
    flex: 1,
    marginRight: 8,
  },
  progressColumn: {
    flex: 1.5,
    marginRight: 8,
  },
  dateColumn: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  lastAccessed: {
    fontSize: 10,
    color: COLORS.GRAY_MEDIUM,
  },
  enrollDate: {
    fontSize: 12,
    color: COLORS.GRAY_DARK,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
});
