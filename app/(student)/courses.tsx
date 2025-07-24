import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '@/constants';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CoursesScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Design'];

  // Mock courses data
  const courses = [
    {
      id: '1',
      title: 'React Native Complete Guide',
      instructor: 'John Doe',
      category: 'Mobile Development',
      price: 89.99,
      rating: 4.8,
      students: 1234,
      duration: '15 hours',
      level: 'Beginner',
      description: 'Learn React Native from scratch and build amazing mobile apps.',
    },
    {
      id: '2',
      title: 'Full Stack Web Development',
      instructor: 'Jane Smith',
      category: 'Web Development',
      price: 99.99,
      rating: 4.7,
      students: 2567,
      duration: '25 hours',
      level: 'Intermediate',
      description: 'Master MERN stack development with hands-on projects.',
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      category: 'Design',
      price: 69.99,
      rating: 4.9,
      students: 987,
      duration: '12 hours',
      level: 'Beginner',
      description: 'Learn the principles of great user interface and experience design.',
    },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const enrollInCourse = (courseId: string, courseTitle: string) => {
    console.log(`Enrolling in course: ${courseTitle}`);
    // This will be implemented with backend integration
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
        {filteredCourses.map((course) => (
          <Card key={course.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>${course.price}</Text>
              </View>
            </View>
            
            <Text style={styles.instructorText}>by {course.instructor}</Text>
            
            <View style={styles.courseStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>⭐ {course.rating}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>👥 {course.students} students</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>⏱️ {course.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>📊 {course.level}</Text>
              </View>
            </View>

            <Text style={styles.courseDescription}>{course.description}</Text>

            <Button
              title="Enroll Now"
              onPress={() => enrollInCourse(course.id, course.title)}
              size="medium"
              style={styles.enrollButton}
            />
          </Card>
        ))}

        {filteredCourses.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No courses found matching your criteria.
            </Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search terms or category filter.
            </Text>
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
});
