import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { COLORS } from '@/constants';
import ApiService from '@/services/api';
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

export default function CoursesScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [categories, setCategories] = useState(['All']);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCourses();
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      const response = await ApiService.getEnrolledCourses();
      if (response.success && response.data) {
        const enrolledData = Array.isArray(response.data) ? response.data : 
                           (response.data.courses || []);
        const enrolledIds = new Set(enrolledData.map((course: any) => course.id || course._id || course.courseId));
        setEnrolledCourses(enrolledIds);
      }
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await ApiService.browseCourses();
      
      if (response.success && response.data) {
        // Handle both array and object with courses property
        const courseData = Array.isArray(response.data) ? response.data : 
                          (response.data.courses || []);
        setCourses(courseData);
        
        // Extract unique categories from the course data
        const uniqueCategories = new Set(['All']);
        courseData.forEach((course: any) => {
          if (course.category) {
            uniqueCategories.add(course.category);
          }
          if (course.subject) {
            uniqueCategories.add(course.subject);
          }
        });
        setCategories(Array.from(uniqueCategories));
        
      } else {
        Alert.alert('Error', 'Failed to load courses');
        setCourses([]);
        setCategories(['All']);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      Alert.alert('Error', 'Failed to load courses');
      setCourses([]);
      setCategories(['All']);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           course.category === selectedCategory ||
                           course.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const enrollInCourse = async (courseId: string, courseTitle: string) => {
    try {
      setEnrolling(courseId);
      const response = await ApiService.enrollInCourse(courseId);
      
      if (response.success) {
        // Add course to enrolled courses set
        setEnrolledCourses(prev => new Set([...prev, courseId]));
        
        Alert.alert(
          'Success!', 
          `Successfully enrolled in ${courseTitle}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Optionally refresh courses
                loadCourses();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      Alert.alert('Error', 'Failed to enroll in course');
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Browse Courses</Text>
          <Text style={styles.subtitle}>Discover new skills and knowledge</Text>
        </View>

        {/* Search */}
        <Input
          label=""
          placeholder="Search courses or instructors..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.resultsText}>
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </Text>

        {/* Courses List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Loading courses...</Text>
          </View>
        ) : (
          <>
            {filteredCourses.map((course: any) => {
              const courseId = course.id || course._id;
              const isEnrolled = enrolledCourses.has(courseId);
              
              return (
                <Card key={courseId} style={[
                  styles.courseCard,
                  isEnrolled && styles.enrolledCourseCard
                ]}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>
                        {course.price ? `$${course.price}` : 'Free'}
                      </Text>
                    </View>
                  </View>
                  
                  {isEnrolled && (
                    <View style={styles.enrolledBadge}>
                      <Text style={styles.enrolledBadgeText}>✓ Enrolled</Text>
                    </View>
                  )}
                  
                  <Text style={styles.instructorText}>
                    by {course.instructorName || course.instructor || 'Instructor'}
                  </Text>
                  
                  <View style={styles.courseStats}>
                    {course.rating && (
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>⭐ {course.rating}</Text>
                      </View>
                    )}
                    {course.enrollmentCount && (
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>👥 {course.enrollmentCount} students</Text>
                      </View>
                    )}
                    {course.duration && (
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>⏱️ {course.duration}</Text>
                      </View>
                    )}
                    {course.level && (
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>📊 {course.level}</Text>
                      </View>
                    )}
                    {course.status && (
                      <View style={styles.statItem}>
                        <Text style={[
                          styles.statLabel,
                          course.status === 'Published' ? styles.statusActive : styles.statusInactive
                        ]}>
                          📋 {course.status}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.courseDescription}>
                    {course.description || 'Course description coming soon.'}
                  </Text>

                  <Button
                    title={
                      isEnrolled 
                        ? "Already Enrolled" 
                        : enrolling === courseId 
                          ? "Enrolling..." 
                          : "Enroll Now"
                    }
                    onPress={() => enrollInCourse(courseId, course.title)}
                    size="medium"
                    style={[
                      styles.enrollButton,
                      isEnrolled && styles.enrolledButton
                    ]}
                    disabled={enrolling === courseId || isEnrolled}
                  />
                </Card>
              );
            })}

            {filteredCourses.length === 0 && !loading && (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No courses found matching your criteria.
                </Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your search terms or category filter.
                </Text>
              </Card>
            )}
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
  searchInput: {
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.WHITE,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 16,
  },
  courseCard: {
    marginBottom: 16,
  },
  enrolledCourseCard: {
    borderWidth: 2,
    borderColor: COLORS.SUCCESS,
    backgroundColor: '#F0FDF4', // Light green background
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    flex: 1,
    marginRight: 12,
  },
  priceContainer: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  instructorText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  courseDescription: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    lineHeight: 20,
    marginBottom: 16,
  },
  enrollButton: {
    alignSelf: 'flex-start',
  },
  enrolledButton: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderColor: COLORS.GRAY_LIGHT,
  },
  enrolledBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  enrolledBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.GRAY_LIGHT,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    marginTop: 12,
  },
  statusActive: {
    color: COLORS.SUCCESS,
  },
  statusInactive: {
    color: COLORS.GRAY_MEDIUM,
  },
});
