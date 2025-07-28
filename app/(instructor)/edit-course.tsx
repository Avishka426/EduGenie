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
  
  // Debug the courseId immediately
  console.log('🔍 EditCourseScreen rendered with courseId:', courseId);
  console.log('🔍 courseId type:', typeof courseId);
  console.log('🔍 courseId length:', courseId?.length);
  
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
  const [status, setStatus] = useState('Draft');

  // Track original values to show changes
  const [originalValues, setOriginalValues] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    level: '',
    content: '',
    duration: '',
    status: 'Draft'
  });

  // Categories and levels
  const categories = [
    'Programming', 'Web Development', 'Mobile Development', 'Data Science',
    'Machine Learning', 'DevOps', 'Database', 'UI/UX Design', 'Business',
    'Marketing', 'Language', 'Other'
  ];
  
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const statuses = ['Draft', 'Published', 'Archived'];

  // Helper function to check if a field has been modified
  const isFieldModified = (field: keyof typeof originalValues, currentValue: string) => {
    return originalValues[field] !== currentValue;
  };

  // Get count of modified fields
  const getModifiedFieldsCount = () => {
    let count = 0;
    if (isFieldModified('title', title)) count++;
    if (isFieldModified('description', description)) count++;
    if (isFieldModified('category', category)) count++;
    if (isFieldModified('price', price)) count++;
    if (isFieldModified('level', level)) count++;
    if (isFieldModified('content', content)) count++;
    if (isFieldModified('duration', duration)) count++;
    if (isFieldModified('status', status)) count++;
    return count;
  };

  const loadCourse = useCallback(async () => {
    console.log('🔄 loadCourse called with courseId:', courseId);
    
    if (!courseId) {
      console.log('❌ No courseId provided, cannot load course');
      setError('No course ID provided');
      setIsLoading(false);
      return;
    }
    
    try {
      setError(null);
      console.log('🔄 Loading course data for ID:', courseId);
      
      const response = await ApiService.getCourseDetails(courseId);
      console.log('📡 Course details response:', response);
      
      if (response.success) {
        const responseData = response.data;
        console.log('📝 Raw response data from API:', JSON.stringify(responseData, null, 2));
        
        // Handle nested course data - API returns { course: {...} } or direct course data
        const courseData = responseData.course || responseData;
        console.log('📝 Extracted course data:', JSON.stringify(courseData, null, 2));
        
        setCourse(courseData);
        
        console.log('📝 Populating form with course data:', courseData);
        
        // Populate form fields with existing data, providing fallbacks
        const newTitle = courseData.title || courseData.name || '';
        const newDescription = courseData.description || '';
        const newCategory = courseData.category || '';
        const newPrice = String(courseData.price ?? '');
        const newLevel = courseData.level || '';
        const newContent = courseData.content || courseData.curriculum || '';
        const newDuration = String(courseData.duration ?? '');
        
        console.log('🔄 Setting form values:', {
          title: newTitle,
          description: newDescription,
          category: newCategory,
          price: newPrice,
          level: newLevel,
          content: newContent,
          duration: newDuration
        });
        
        setTitle(newTitle);
        setDescription(newDescription);
        setCategory(newCategory);
        setPrice(newPrice);
        setLevel(newLevel);
        setContent(newContent);
        setDuration(newDuration);
        
        // Handle status with multiple possible formats
        let courseStatus = courseData.status || 'draft';
        if (typeof courseStatus === 'string') {
          // Normalize status to match our UI options
          courseStatus = courseStatus.toLowerCase();
          if (courseStatus === 'active' || courseStatus === 'published') {
            courseStatus = 'Published';
          } else if (courseStatus === 'draft') {
            courseStatus = 'Draft';
          } else if (courseStatus === 'archived' || courseStatus === 'inactive') {
            courseStatus = 'Archived';
          } else {
            // Default to Draft for unknown statuses
            courseStatus = 'Draft';
          }
        }
        
        console.log('🔄 Setting status to:', courseStatus);
        setStatus(courseStatus);
        
        // Store original values for comparison
        const originalData = {
          title: newTitle,
          description: newDescription,
          category: newCategory,
          price: newPrice,
          level: newLevel,
          content: newContent,
          duration: newDuration,
          status: courseStatus
        };
        
        console.log('💾 Storing original values:', originalData);
        setOriginalValues(originalData);
        
        console.log('✅ Form populated successfully');
      } else {
        const errorMsg = response.error || 'Failed to load course';
        console.log('❌ API error:', errorMsg);
        setError(errorMsg);
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('💥 Error loading course:', error);
      setError(errorMsg);
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const handleDurationChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setDuration(numericValue);
  };

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
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid duration in hours');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!course) return; // Ensure we have the original course data
    
    setIsSaving(true);
    
    try {
      console.log('💾 Saving course changes...');
      
      // Only include fields that have actually changed or are required
      // This preserves any other fields that might exist in the original course
      const courseData = {
        ...course, // Start with all existing course data
        // Override only the fields from the form
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        level,
        content: content.trim(),
        duration: Number(duration),
        status: status, // Keep original case - backend expects "Published", not "published"
      };
      
      console.log('📝 Course data to update:', courseData);
      console.log('🔄 Original course data:', course);
      
      const response = await ApiService.updateCourse(courseId, courseData);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Course updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.push('./courses')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('💥 Error saving course:', error);
      Alert.alert('Error', 'Failed to update course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const modifiedCount = getModifiedFieldsCount();
    if (modifiedCount > 0) {
      Alert.alert(
        'Discard Changes',
        `You have ${modifiedCount} unsaved change${modifiedCount !== 1 ? 's' : ''}. Are you sure you want to discard them?`,
        [
          { text: 'Continue Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.push('./courses') }
        ]
      );
    } else {
      router.push('./courses');
    }
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Changes',
      'This will revert all fields to their original values. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: () => {
            setTitle(originalValues.title);
            setDescription(originalValues.description);
            setCategory(originalValues.category);
            setPrice(originalValues.price);
            setLevel(originalValues.level);
            setContent(originalValues.content);
            setDuration(originalValues.duration);
            setStatus(originalValues.status);
          }
        }
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
          <Text style={styles.debugText}>Course ID: {courseId}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.debugText}>Course ID: {courseId}</Text>
          <Button
            title="Retry"
            onPress={loadCourse}
            style={styles.retryButton}
          />
          <Button
            title="Go Back"
            onPress={() => router.push('./courses')}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Course not found</Text>
          <Text style={styles.debugText}>Course ID: {courseId}</Text>
          <Text style={styles.debugText}>Loaded successfully but no course data</Text>
          <Button
            title="Go Back"
            onPress={() => router.push('./courses')}
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
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleCancel}
              >
                <Text style={styles.backButtonText}>← Cancel</Text>
              </TouchableOpacity>
              
              {!isLoading && getModifiedFieldsCount() > 0 && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetAll}
                >
                  <Text style={styles.resetButtonText}>↻ Reset All</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.title}>Edit Course</Text>
            <Text style={styles.subtitle}>
              Update your course information • Current data is pre-loaded
              {!isLoading && getModifiedFieldsCount() > 0 && (
                <Text style={styles.modifiedText}>
                  {' • '}{getModifiedFieldsCount()} field{getModifiedFieldsCount() !== 1 ? 's' : ''} modified
                </Text>
              )}
            </Text>
            
            {error && (
              <Text style={styles.errorText}>⚠️ {error}</Text>
            )}
            
            {isLoading && (
              <View style={styles.loadingBanner}>
                <Text style={styles.loadingBannerText}>📄 Loading current course data...</Text>
              </View>
            )}
            
            {/* Debug Information */}
            
          </View>

          {/* Basic Information */}
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Basic Information</Text>
            
            <View>
              <Text style={styles.label}>
                Course Title *
                {isFieldModified('title', title) && (
                  <Text style={styles.modifiedIndicator}> ● MODIFIED</Text>
                )}
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="Enter course title"
              />
            </View>
            
            <View style={styles.textAreaContainer}>
              <Text style={styles.label}>
                Course Description *
                {isFieldModified('description', description) && (
                  <Text style={styles.modifiedIndicator}> ● MODIFIED</Text>
                )}
              </Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what students will learn in this course..."
                multiline
                numberOfLines={4}
                inputStyle={styles.textArea}
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
              label={`Price (USD) *${isFieldModified('price', price) ? ' ● MODIFIED' : ''}`}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <Input
              label="Duration (Hours) *"
              value={duration}
              onChangeText={handleDurationChange}
              placeholder="e.g., 10"
              keyboardType="numeric"
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
                inputStyle={styles.textArea}
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
                {status === 'Draft' && '• Draft: Course is not visible to students'}
                {status === 'Published' && '• Published: Course is live and available for enrollment'}
                {status === 'Archived' && '• Archived: Course is hidden but existing students can still access'}
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
              title={
                isSaving 
                  ? "Saving..." 
                  : getModifiedFieldsCount() > 0 
                    ? `Save ${getModifiedFieldsCount()} Change${getModifiedFieldsCount() !== 1 ? 's' : ''}`
                    : "No Changes"
              }
              onPress={handleSave}
              disabled={isSaving || getModifiedFieldsCount() === 0}
              style={styles.saveButton}
            />
          </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ff9800',
    borderRadius: 6,
  },
  resetButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
  },
  loadingBanner: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  loadingBannerText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  modifiedText: {
    color: '#ff9800',
    fontWeight: '600',
  },
  modifiedIndicator: {
    color: '#ff9800',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
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
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  retryButton: {
    marginBottom: 12,
  },
  debugContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
});
