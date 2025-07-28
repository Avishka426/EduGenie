import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { COLORS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import ApiService from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  // Use real user data from auth context
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    joinDate: 'Recently joined',
    location: '',
  });

  const [editedProfile, setEditedProfile] = useState(userProfile);

  // Learning stats from API
  const [learningStats, setLearningStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    streak: 0,
    favoriteCategory: 'Not determined yet',
  });

  useEffect(() => {
    loadLearningStats();
    loadProfileData();
  }, []);

  // Debug log to track profilePicture state changes
  useEffect(() => {
    console.log('Profile picture state changed:', profilePicture);
  }, [profilePicture]);

  const loadProfileData = async () => {
    try {
      const response = await ApiService.getProfile();
      console.log('Profile data response:', response); // Debug log
      
      if (response.success && response.data) {
        const profile = response.data.user || response.data; // Handle nested user object
        console.log('Profile picture from API:', profile.profilePicture); // Debug log
        
        setProfilePicture(profile.profilePicture || null);
        
        // Update user profile with data from API
        setUserProfile(prev => ({
          ...prev,
          name: profile.name || prev.name,
          email: profile.email || prev.email,
          phone: profile.phone || prev.phone,
          bio: profile.bio || prev.bio,
          location: profile.location || prev.location,
        }));
        setEditedProfile(prev => ({
          ...prev,
          name: profile.name || prev.name,
          email: profile.email || prev.email,
          phone: profile.phone || prev.phone,
          bio: profile.bio || prev.bio,
          location: profile.location || prev.location,
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const loadLearningStats = async () => {
    try {
      setIsLoading(true);
      // Get enrolled courses to calculate stats
      const response = await ApiService.getEnrolledCourses();
      
      if (response.success && response.data) {
        const courses = response.data.enrolledCourses || response.data || [];
        
        // Calculate real learning statistics
        const totalCourses = courses.length;
        const completedCourses = courses.filter((course: any) => 
          course.status === 'completed').length;
        const totalHours = courses.reduce((total: number, course: any) => 
          total + (course.duration || 0), 0);
        
        // Determine favorite category
        const categoryCount: { [key: string]: number } = {};
        courses.forEach((course: any) => {
          const category = course.category || 'Other';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        const favoriteCategory = Object.keys(categoryCount).length > 0 
          ? Object.keys(categoryCount).reduce((a, b) => 
              categoryCount[a] > categoryCount[b] ? a : b)
          : 'Not determined yet';
        
        setLearningStats({
          totalCourses,
          completedCourses,
          totalHours,
          certificates: completedCourses, // Assuming certificates = completed courses
          streak: 0, // This would need to be tracked by the backend
          favoriteCategory,
        });
      }
    } catch (error) {
      console.error('Error loading learning stats:', error);
    } finally {
      setIsLoading(false);
    }
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
        
        // Ensure the URL is valid
        if (newProfilePicture && (newProfilePicture.startsWith('http') || newProfilePicture.startsWith('https'))) {
          setProfilePicture(newProfilePicture);
          
          // Refresh profile data to ensure we have the latest information
          await loadProfileData();
          
          Alert.alert('Success', 'Profile picture updated successfully!');
        } else {
          console.error('Invalid image URL received:', newProfilePicture);
          Alert.alert('Error', 'Invalid image URL received from server');
        }
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
                setIsUploadingPicture(true);
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
              } finally {
                setIsUploadingPicture(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in removeProfilePicture:', error);
    }
  };

  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {/* Debug refresh button */}
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: COLORS.SUCCESS }]}
              onPress={loadProfileData}
            >
              <Text style={styles.editButtonText}>↻</Text>
            </TouchableOpacity>
            
            {!isEditing && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Profile Info */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleImagePicker} style={styles.avatar}>
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
                  {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
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

            <Text style={styles.memberSince}>
              Member since {userProfile.joinDate}
            </Text>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Full Name"
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
                style={styles.input}
              />
              <Input
                label="Email"
                value={editedProfile.email}
                onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
                keyboardType="email-address"
                style={styles.input}
              />
              <Input
                label="Phone"
                value={editedProfile.phone}
                onChangeText={(text) => setEditedProfile({...editedProfile, phone: text})}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <Input
                label="Location"
                value={editedProfile.location}
                onChangeText={(text) => setEditedProfile({...editedProfile, location: text})}
                style={styles.input}
              />
              <Input
                label="Bio"
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({...editedProfile, bio: text})}
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <View style={styles.editActions}>
                <Button
                  title="Cancel"
                  onPress={handleCancelEdit}
                  variant="secondary"
                  size="medium"
                  style={styles.actionButton}
                />
                <Button
                  title="Save Changes"
                  onPress={handleSaveProfile}
                  size="medium"
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{userProfile.name}</Text>
              <Text style={styles.email}>{userProfile.email}</Text>
              <Text style={styles.phone}>{userProfile.phone}</Text>
              <Text style={styles.location}>{userProfile.location}</Text>
              <Text style={styles.bio}>{userProfile.bio}</Text>
            </View>
          )}
        </Card>

        {/* Learning Statistics */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Learning Statistics</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              <Text style={styles.loadingText}>Loading your learning progress...</Text>
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{learningStats.totalCourses}</Text>
                <Text style={styles.statLabel}>Enrolled Courses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{learningStats.completedCourses}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{learningStats.totalHours}</Text>
                <Text style={styles.statLabel}>Hours Learned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{learningStats.certificates}</Text>
                <Text style={styles.statLabel}>Certificates</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{learningStats.streak || 'N/A'}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statCategory}>{learningStats.favoriteCategory}</Text>
                <Text style={styles.statLabel}>Favorite Category</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button
            title="View Certificates"
            onPress={() => console.log('View certificates')}
            variant="secondary"
            size="medium"
            style={styles.quickActionButton}
          />
          <Button
            title="Learning Analytics"
            onPress={() => console.log('View analytics')}
            variant="secondary"
            size="medium"
            style={styles.quickActionButton}
          />
          <Button
            title="Account Settings"
            onPress={() => console.log('Account settings')}
            variant="secondary"
            size="medium"
            style={styles.quickActionButton}
          />
          <Button
            title="Help & Support"
            onPress={() => console.log('Help & Support')}
            variant="secondary"
            size="medium"
            style={styles.quickActionButton}
          />
        </Card>

        {/* Logout */}
        <Card style={styles.logoutCard}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            size="medium"
            style={styles.logoutButton}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  editButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 25,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileCard: {
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  memberSince: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    fontWeight: '500',
  },
  profileInfo: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    marginBottom: 16,
  },
  bio: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  editForm: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  statsCard: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 6,
  },
  statCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 6,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    fontWeight: '600',
  },
  actionsCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  quickActionButton: {
    marginBottom: 16,
  },
  logoutCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: COLORS.ERROR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButton: {
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.TEXT_MUTED,
    marginTop: 16,
    fontWeight: '500',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  avatarActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 20,
    shadowColor: COLORS.SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarActionText: {
    fontSize: 13,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  avatarRemoveButton: {
    backgroundColor: COLORS.ERROR,
  },
  avatarRemoveText: {
    color: COLORS.WHITE,
  },
});
