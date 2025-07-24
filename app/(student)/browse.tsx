import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
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

interface Course {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  category: string;
  price: number;
  level: string;
  duration?: number;
  thumbnail?: string;
  tags?: string[];
  enrollmentCount: number;
  maxStudents?: number;
  status: string;
  createdAt: string;
  isEnrolled?: boolean;
}

export default function BrowseCoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const handleViewDetails = (courseId: string) => {
    // TODO: Navigate to course details screen
    console.log('View course details:', courseId);
    // router.push(`./course-details?id=${courseId}`);
  };

  const loadCourses = async () => {
    try {
      // Build filters object
      const filters: any = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory !== 'All') filters.category = selectedCategory;
      if (selectedLevel !== 'All') filters.level = selectedLevel;
      if (priceRange.min) filters.priceMin = Number(priceRange.min);
      if (priceRange.max) filters.priceMax = Number(priceRange.max);

      const response = await ApiService.browseCourses(filters);
      
      if (response.success && response.data) {
        // Handle the API response structure { courses: [...], pagination: {...} }
        const coursesData = response.data.courses || response.data || [];
        setCourses(coursesData);
        console.log('📚 Loaded courses:', coursesData.length);
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

  const loadCategories = async () => {
    try {
      const response = await ApiService.getCourseCategories();
      if (response.success && response.data) {
        // Handle the API response structure { categories: [...] }
        const categoriesData = response.data.categories || response.data || [];
        const categoryNames = categoriesData.map((cat: any) => 
          typeof cat === 'string' ? cat : cat.name || cat.value
        );
        setCategories(['All', ...categoryNames]);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
    }
  };

  const handleEnroll = async (course: Course) => {
    if (course.isEnrolled) {
      Alert.alert('Already Enrolled', 'You are already enrolled in this course');
      return;
    }

    Alert.alert(
      'Enroll in Course',
      `Do you want to enroll in "${course.title}" for $${course.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enroll',
          onPress: async () => {
            try {
              const response = await ApiService.enrollInCourse(course.id);
              if (response.success) {
                Alert.alert('Success!', 'You have successfully enrolled in this course');
                loadCourses(); // Refresh to update enrollment status
              } else {
                Alert.alert('Error', response.error || 'Failed to enroll in course');
              }
            } catch (error) {
              console.error('❌ Error enrolling in course:', error);
              Alert.alert('Error', 'Failed to enroll in course');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setPriceRange({ min: '', max: '' });
  };

  useEffect(() => {
    loadCategories();
    loadCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reload courses when filters change
    if (!isLoading) {
      loadCourses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedLevel, priceRange]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading courses...</Text>
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
          <Text style={styles.title}>Browse Courses</Text>
          <Text style={styles.subtitle}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} available
          </Text>
        </View>

        {/* Search */}
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />

        {/* Filters */}
        <Card style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          {/* Category Filter */}
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipSelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Level Filter */}
          <Text style={styles.filterLabel}>Level</Text>
          <View style={styles.levelButtons}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  selectedLevel === level && styles.levelButtonSelected
                ]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text style={[
                  styles.levelButtonText,
                  selectedLevel === level && styles.levelButtonTextSelected
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text style={styles.filterLabel}>Price Range</Text>
          <View style={styles.priceRange}>
            <Input
              placeholder="Min"
              value={priceRange.min}
              onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
              keyboardType="numeric"
              style={styles.priceInput}
            />
            <Text style={styles.priceSeparator}>-</Text>
            <Input
              placeholder="Max"
              value={priceRange.max}
              onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
              keyboardType="numeric"
              style={styles.priceInput}
            />
          </View>

          <Button
            title="Clear Filters"
            onPress={clearFilters}
            variant="secondary"
            size="small"
            style={styles.clearButton}
          />
        </Card>

        {/* Courses List */}
        {courses.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters to find more courses.
            </Text>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.instructorName}>by {course.instructorName}</Text>
                  <Text style={styles.courseCategory}>{course.category} • {course.level}</Text>
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
                  <Text style={styles.statIcon}>👥</Text>
                  <Text style={styles.statText}>{course.enrollmentCount} students</Text>
                </View>
                {course.duration && (
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>⏱️</Text>
                    <Text style={styles.statText}>{course.duration}h</Text>
                  </View>
                )}
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>📚</Text>
                  <Text style={styles.statText}>{course.status}</Text>
                </View>
              </View>

              <View style={styles.courseActions}>
                <Button
                  title="View Details"
                  onPress={() => handleViewDetails(course.id)}
                  variant="secondary"
                  size="small"
                  style={styles.actionButton}
                />
                <Button
                  title={course.isEnrolled ? "Already Enrolled" : "Enroll Now"}
                  onPress={() => handleEnroll(course)}
                  disabled={course.isEnrolled}
                  size="small"
                  style={styles.enrollButton}
                />
              </View>
            </Card>
          ))
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
  searchInput: {
    marginBottom: 16,
  },
  filtersCard: {
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterChipText: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
  },
  filterChipTextSelected: {
    color: COLORS.WHITE,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  levelButton: {
    flex: 1,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  levelButtonSelected: {
    backgroundColor: COLORS.PRIMARY,
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.GRAY_DARK,
  },
  levelButtonTextSelected: {
    color: COLORS.WHITE,
  },
  priceRange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
  },
  clearButton: {
    marginTop: 8,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  courseCard: {
    marginBottom: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 2,
  },
  courseCategory: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  coursePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  courseDescription: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statText: {
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
  enrollButton: {
    flex: 1,
  },
});


