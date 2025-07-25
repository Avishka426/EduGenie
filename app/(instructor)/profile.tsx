import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { COLORS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import ApiService from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function InstructorProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [instructorStats, setInstructorStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  // Debug log to track profilePicture state changes
  useEffect(() => {
    console.log('Instructor profile picture state changed:', profilePicture);
  }, [profilePicture]);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      
      // Load profile data including profile picture
      const profileResponse = await ApiService.getProfile();
      console.log('Instructor profile data response:', profileResponse); // Debug log
      
      if (profileResponse.success && profileResponse.data) {
        const profile = profileResponse.data.user || profileResponse.data; // Handle nested user object
        const profilePictureUrl = profile.profilePicture || null;
        console.log('Instructor profile picture from API:', profilePictureUrl); // Debug log
        setProfilePicture(profilePictureUrl);
      }
      
      // Fetch instructor's courses
      const coursesResponse = await ApiService.getCourses();
      const courses = Array.isArray(coursesResponse) ? coursesResponse : [];
      setCoursesData(courses);
      
      // Calculate total students across all courses
      let totalStudents = 0;
      let totalRatings = 0;
      let ratingCount = 0;
      
      for (const course of courses) {
        try {
          // Get students for each course
          const studentsResponse = await ApiService.getCourseStudents(course.id);
          const students = Array.isArray(studentsResponse) ? studentsResponse : [];
          totalStudents += students.length;
          
          // Calculate average rating if available
          if (course.rating && course.rating > 0) {
            totalRatings += course.rating;
            ratingCount++;
          }
        } catch (error) {
          console.log(`Error fetching students for course ${course.id}:`, error);
        }
      }
      
      const averageRating = ratingCount > 0 ? (totalRatings / ratingCount) : 0;
      
      setInstructorStats({
        totalCourses: courses.length,
        totalStudents,
        averageRating: Math.round(averageRating * 10) / 10
      });
      
    } catch (error) {
      console.error('Error fetching instructor data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
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

  const handleEditProfile = () => {
    Alert.alert('Feature Coming Soon', 'Profile editing feature will be available in a future update.');
  };

  const handleChangePassword = () => {
    Alert.alert('Feature Coming Soon', 'Password change feature will be available in a future update.');
  };

  const handleImagePicker = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permission to upload profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', // Lowercase string literal
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadProfilePicture = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      setIsUploadingPicture(true);

      const response = await ApiService.uploadProfilePicture(asset.uri);
      console.log('Upload response:', response); // Debug log

      if (response.success && response.data) {
        // Try different possible response formats
        const newProfilePicture = response.data.profilePicture || response.data.imageUrl || response.data.url;
        console.log('New profile picture URL:', newProfilePicture); // Debug log
        
        setProfilePicture(newProfilePicture);
        
        // Refresh profile data to ensure we have the latest information
        await fetchInstructorData();
        
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        console.error('Upload failed:', response.error); // Debug log
        Alert.alert('Error', response.error || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const removeProfilePicture = async () => {
    try {
      Alert.alert(
        'Remove Profile Picture',
        'Are you sure you want to remove your profile picture?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await ApiService.removeProfilePicture();

                if (response.success) {
                  setProfilePicture(null);
                  Alert.alert('Success', 'Profile picture removed successfully!');
                } else {
                  Alert.alert('Error', response.error || 'Failed to remove profile picture');
                }
              } catch (error) {
                console.error('Error removing profile picture:', error);
                Alert.alert('Error', 'Failed to remove profile picture. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in removeProfilePicture:', error);
      Alert.alert('Error', 'Failed to remove profile picture. Please try again.');
    }
  };

  const handleNotificationSettings = () => {
    Alert.alert('Feature Coming Soon', 'Notification settings will be available in a future update.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Instructor Profile</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchInstructorData}
            disabled={loading}
          >
            <Text style={styles.refreshText}>
              {loading ? '⟳ Refreshing...' : '↻ Refresh Data'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Profile Information</Text>
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={handleImagePicker} style={styles.avatarContainer}>
              {profilePicture ? (
                <Image 
                  source={{ 
                    uri: profilePicture,
                    cache: 'reload' // Force refresh the image
                  }} 
                  style={styles.avatarImage}
                  onLoad={() => console.log('Image loaded successfully:', profilePicture)}
                  onError={(error) => {
                    console.error('Image load error:', error);
                    console.log('Failed image URI:', profilePicture);
                    // If image fails to load, reset to null to show initials
                    setProfilePicture(null);
                  }}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Profile Picture Actions */}
            <View style={styles.avatarActions}>
              <TouchableOpacity 
                onPress={handleImagePicker}
                style={styles.avatarActionButton}
                disabled={isUploadingPicture}
              >
                <Text style={styles.avatarActionText}>
                  {isUploadingPicture ? 'Uploading...' : (profilePicture ? 'Change' : 'Add Photo')}
                </Text>
              </TouchableOpacity>
              
              {profilePicture && (
                <TouchableOpacity 
                  onPress={removeProfilePicture}
                  style={[styles.avatarActionButton, styles.avatarRemoveButton]}
                  disabled={isUploadingPicture}
                >
                  <Text style={[styles.avatarActionText, styles.avatarRemoveText]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'Instructor Name'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'instructor@example.com'}</Text>
              <Text style={styles.userRole}>Role: Instructor</Text>
            </View>
          </View>
          <Button
            title="✏️ Edit Profile"
            onPress={handleEditProfile}
            variant="secondary"
            size="medium"
            style={styles.editButton}
          />
        </Card>

        {/* Teaching Statistics */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Teaching Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.totalCourses}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{instructorStats.averageRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </Card>

        {/* Account Settings */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleChangePassword}>
            <Text style={styles.settingIcon}>🔒</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingDescription}>Update your account password</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleNotificationSettings}>
            <Text style={styles.settingIcon}>🔔</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notification Settings</Text>
              <Text style={styles.settingDescription}>Manage your notification preferences</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Card>

        

        {/* Recent Courses */}
        {!loading && coursesData.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Recent Courses</Text>
            {coursesData.slice(0, 3).map((course, index) => (
              <View key={course.id || index} style={styles.courseItem}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title || course.name || `Course ${index + 1}`}</Text>
                  <Text style={styles.courseDescription} numberOfLines={2}>
                    {course.description || 'No description available'}
                  </Text>
                </View>
                <View style={styles.courseStats}>
                  <Text style={styles.courseStatText}>
                    {course.studentCount || 0} students
                  </Text>
                </View>
              </View>
            ))}
            {coursesData.length > 3 && (
              <Text style={styles.moreCoursesText}>
                +{coursesData.length - 3} more courses
              </Text>
            )}
          </Card>
        )}

        {/* Support & Help */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Support & Help</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Help Center', 'Help center feature will be available soon.')}
          >
            <Text style={styles.settingIcon}>❓</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>Get help with using the platform</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Contact Support', 'Support contact feature will be available soon.')}
          >
            <Text style={styles.settingIcon}>📞</Text>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Contact Support</Text>
              <Text style={styles.settingDescription}>Get in touch with our support team</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <Card style={styles.card}>
          <Button
            title="🚪 Logout"
            onPress={handleLogout}
            variant="secondary"
            size="large"
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 12,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 6,
  },
  refreshText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
  },
  settingArrow: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
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
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    color: COLORS.WHITE,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_LIGHT,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
  },
  courseStats: {
    alignItems: 'flex-end',
  },
  courseStatText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  moreCoursesText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    fontStyle: 'italic',
    marginTop: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarActions: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  avatarActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 16,
  },
  avatarActionText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  avatarRemoveButton: {
    backgroundColor: COLORS.ERROR,
  },
  avatarRemoveText: {
    color: COLORS.WHITE,
  },
});
