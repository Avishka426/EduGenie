import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { COLORS } from '@/constants';
import ApiService from '@/services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
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
  content?: string;
  duration?: number | string;
  status?: string;
  [key: string]: any;
}

export default function EditCourseScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [level, setLevel] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('draft');

  // Categories and levels
  const categories = [
    'Programming', 'Web Development', 'Mobile Development', 'Data Science',
    'Machine Learning', 'DevOps', 'Database', 'UI/UX Design', 'Business',
    'Marketing', 'Language', 'Other'
  ];
  
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const statuses = ['draft', 'published', 'archived'];

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setError(null);
      console.log('🔄 Loading course for editing:', courseId);
      
      const response = await ApiService.getCourseDetails(courseId);
      console.log('📚 Course details response:', response);
      
      if (response.success) {
        const courseData = response.data;
        setCourse(courseData);
        
        // Populate form fields
        setTitle(courseData.title || '');
        setDescription(courseData.description || '');
        setCategory(courseData.category || '');
        setPrice(String(courseData.price || ''));
        setLevel(courseData.level || '');
        setContent(courseData.content || '');
        setDuration(String(courseData.duration || ''));
        setStatus(courseData.status || 'draft');
      } else {
        setError(response.error || 'Failed to load course');
        Alert.alert('Error', response.error || 'Failed to load course details');
      }
    } catch (error) {
      console.error('❌ Error loading course:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Course title is required');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Course description is required');
      return false;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category');
      return false;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      Alert.alert('Validation Error', 'Please enter a valid price');
      return false;
    }
    if (!level) {
      Alert.alert('Validation Error', 'Please select a level');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      console.log('💾 Saving course changes...');
      
      const courseData = {
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        level,
        content: content.trim(),
        duration: duration.trim(),
        status,
      };
      
      console.log('📝 Course data to update:', courseData);
      
      const response = await ApiService.updateCourse(courseId, courseData);
      console.log('💾 Update response:', response);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Course updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('❌ Error updating course:', error);
      Alert.alert('Error', 'Failed to update course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading course...</Text>
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
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleCancel}
            >
              <Text style={styles.backButtonText}>← Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Edit Course</Text>
            <Text style={styles.subtitle}>Update your course information</Text>
            
            {error && (
              <Text style={styles.errorText}>⚠️ {error}</Text>
            )}
          </View>

          {/* Basic Information */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Basic Information</Text>
            
            <Input
              label="Course Title *"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter course title"
              style={styles.input}
            />
            
            <View style={styles.textAreaContainer}>
              <Text style={styles.label}>Course Description *</Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what students will learn in this course..."
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
              />
            </View>
          </Card>

          {/* Course Details */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Course Details</Text>
            
            {/* Category Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.optionButton,
                      category === cat && styles.selectedOption
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.optionText,
                      category === cat && styles.selectedOptionText
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Level Selection */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Level *</Text>
              <View style={styles.optionsRow}>
                {levels.map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.optionButton,
                      level === lvl && styles.selectedOption
                    ]}
                    onPress={() => setLevel(lvl)}
                  >
                    <Text style={[
                      styles.optionText,
                      level === lvl && styles.selectedOptionText
                    ]}>
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input
              label="Price (USD) *"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="numeric"
              style={styles.input}
            />

            <Input
              label="Duration"
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 10 hours, 5 weeks, etc."
              style={styles.input}
            />
          </Card>

          {/* Course Content */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Course Content</Text>
            
            <View style={styles.textAreaContainer}>
              <Text style={styles.label}>Course Content</Text>
              <Input
                value={content}
                onChangeText={setContent}
                placeholder="Describe the course curriculum, lessons, and what students will learn..."
                multiline
                numberOfLines={6}
                style={[styles.input, styles.textArea]}
              />
            </View>
          </Card>

          {/* Course Status */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Course Status</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Publication Status</Text>
              <View style={styles.optionsRow}>
                {statuses.map((stat) => (
                  <TouchableOpacity
                    key={stat}
                    style={[
                      styles.optionButton,
                      status === stat && styles.selectedOption
                    ]}
                    onPress={() => setStatus(stat)}
                  >
                    <Text style={[
                      styles.optionText,
                      status === stat && styles.selectedOptionText
                    ]}>
                      {stat.charAt(0).toUpperCase() + stat.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.statusInfo}>
              <Text style={styles.statusInfoText}>
                {status === 'draft' && '• Draft: Course is not visible to students'}
                {status === 'published' && '• Published: Course is live and available for enrollment'}
                {status === 'archived' && '• Archived: Course is hidden but existing students can still access'}
              </Text>
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="secondary"
              style={styles.cancelButton}
            />
            <Button
              title={isSaving ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveButton}
            />
          </View>

          {/* Debug Info */}
          {__DEV__ && (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>🔧 Debug Info</Text>
              <Text style={styles.debugText}>Course ID: {courseId}</Text>
              <Text style={styles.debugText}>Current Status: {status}</Text>
              <Text style={styles.debugText}>Form Valid: {validateForm().toString()}</Text>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
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
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginBottom: 16,
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
  input: {
    marginBottom: 16,
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  horizontalScroll: {
    marginVertical: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    backgroundColor: COLORS.WHITE,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: COLORS.WHITE,
  },
  statusInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
  },
  statusInfoText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
  debugText: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 4,
  },
});
