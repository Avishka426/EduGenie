import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import ApiService from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CreateCourseScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    price: '',
    duration: '',
    level: 'Beginner',
    thumbnail: '',
    tags: '',
    maxStudents: '',
    prerequisites: '',
    whatYouWillLearn: '',
  });

  const categories = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cybersecurity',
    'Cloud Computing',
    'Database',
    'DevOps',
    'UI/UX Design',
    'Business',
    'Marketing',
    'Other',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleCreateCourse = async () => {
    // Basic validation
    if (!courseData.title || !courseData.description || !courseData.content || !courseData.category || !courseData.price) {
      Alert.alert('Error', 'Please fill in all required fields (title, description, content, category, price)');
      return;
    }

    if (isNaN(Number(courseData.price)) || Number(courseData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (isNaN(Number(courseData.duration)) || Number(courseData.duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in hours');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare course data for API
      const apiData: any = {
        title: courseData.title,
        description: courseData.description,
        content: courseData.content,
        category: courseData.category,
        price: Number(courseData.price),
        duration: Number(courseData.duration),
        level: courseData.level,
      };

      // Add optional fields if provided
      if (courseData.thumbnail) apiData.thumbnail = courseData.thumbnail;
      if (courseData.tags) apiData.tags = courseData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (courseData.maxStudents) apiData.maxStudents = Number(courseData.maxStudents);
      if (courseData.prerequisites) apiData.prerequisites = courseData.prerequisites;
      if (courseData.whatYouWillLearn) apiData.whatYouWillLearn = courseData.whatYouWillLearn;

      // Call the backend API to create the course
      const response = await ApiService.createCourse(apiData);

      if (response.success) {
        console.log('📚 Course created successfully:', response.data);

        Alert.alert(
          '✅ Course Created!',
          `"${courseData.title}" has been successfully created and saved.`,
          [
            {
              text: 'Create Another',
              onPress: () => {
                setCourseData({
                  title: '',
                  description: '',
                  content: '',
                  category: '',
                  price: '',
                  duration: '',
                  level: 'Beginner',
                  thumbnail: '',
                  tags: '',
                  maxStudents: '',
                  prerequisites: '',
                  whatYouWillLearn: '',
                });
              },
            },
            {
              text: 'Go to Dashboard',
              onPress: () => router.replace('/(instructor)/dashboard'),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to create course');
      }
    } catch (error) {
      console.error('❌ Course creation error:', error);
      Alert.alert('Error', 'Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create New Course</Text>
          <Text style={styles.subtitle}>Share your knowledge with students worldwide</Text>
        </View>

        {/* Course Basic Information */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Text style={styles.label}>Course Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Complete React Native Development"
            value={courseData.title}
            onChangeText={(text) => setCourseData({...courseData, title: text})}
            maxLength={100}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what students will learn in this course..."
            value={courseData.description}
            onChangeText={(text) => setCourseData({...courseData, description: text})}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          <Text style={styles.label}>Course Content *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Module 1: Introduction&#10;Module 2: Basic Concepts&#10;Module 3: Advanced Topics..."
            value={courseData.content}
            onChangeText={(text) => setCourseData({...courseData, content: text})}
            multiline
            numberOfLines={6}
            maxLength={2000}
          />

          <Text style={styles.label}>Thumbnail URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/thumbnail.jpg"
            value={courseData.thumbnail}
            onChangeText={(text) => setCourseData({...courseData, thumbnail: text})}
          />

          <Text style={styles.label}>Tags (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="javascript, programming, beginner (comma separated)"
            value={courseData.tags}
            onChangeText={(text) => setCourseData({...courseData, tags: text})}
          />

          <Text style={styles.label}>Max Students (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Leave blank for unlimited"
            value={courseData.maxStudents}
            onChangeText={(text) => setCourseData({...courseData, maxStudents: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  courseData.category === category && styles.categoryButtonSelected
                ]}
                onPress={() => setCourseData({...courseData, category})}
              >
                <Text style={[
                  styles.categoryButtonText,
                  courseData.category === category && styles.categoryButtonTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Course Details */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Course Details</Text>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Price ($) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={courseData.price}
                onChangeText={(text) => setCourseData({...courseData, price: text})}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Duration (hours)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 10"
                value={courseData.duration}
                onChangeText={(text) => setCourseData({...courseData, duration: text})}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Difficulty Level</Text>
          <View style={styles.levelButtons}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  courseData.level === level && styles.levelButtonSelected
                ]}
                onPress={() => setCourseData({...courseData, level})}
              >
                <Text style={[
                  styles.levelButtonText,
                  courseData.level === level && styles.levelButtonTextSelected
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Additional Information */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <Text style={styles.label}>Prerequisites</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What should students know before taking this course?"
            value={courseData.prerequisites}
            onChangeText={(text) => setCourseData({...courseData, prerequisites: text})}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>What You Will Learn</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="List the key skills and knowledge students will gain..."
            value={courseData.whatYouWillLearn}
            onChangeText={(text) => setCourseData({...courseData, whatYouWillLearn: text})}
            multiline
            numberOfLines={4}
          />
        </Card>

        {/* Create Button */}
        <Button
          title={isLoading ? "Creating Course..." : "Create Course"}
          onPress={handleCreateCourse}
          disabled={isLoading}
          loading={isLoading}
          style={styles.createButton}
        />
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
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
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.GRAY_MEDIUM,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.WHITE,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GRAY_MEDIUM,
    backgroundColor: COLORS.WHITE,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
  },
  categoryButtonTextSelected: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.GRAY_MEDIUM,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
  },
  levelButtonSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  levelButtonText: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    fontWeight: '600',
  },
  levelButtonTextSelected: {
    color: COLORS.WHITE,
  },
  createButton: {
    marginTop: 16,
    marginBottom: 20,
  },
});
