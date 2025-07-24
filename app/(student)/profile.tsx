import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Use real user data from auth context or mock data
  const [userProfile, setUserProfile] = useState({
    name: user?.username || 'John Student',
    email: user?.email || 'john.student@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate learner interested in mobile development and AI.',
    joinDate: 'January 2024',
    location: 'New York, USA',
  });

  const [editedProfile, setEditedProfile] = useState(userProfile);

  // Mock learning stats
  const learningStats = {
    totalCourses: 3,
    completedCourses: 1,
    totalHours: 45,
    certificates: 1,
    streak: 7,
    favoriteCategory: 'Mobile Development',
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
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Info */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </Text>
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
              <Text style={styles.location}>📍 {userProfile.location}</Text>
              <Text style={styles.bio}>{userProfile.bio}</Text>
            </View>
          )}
        </Card>

        {/* Learning Statistics */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Learning Statistics</Text>
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
              <Text style={styles.statNumber}>{learningStats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statCategory}>{learningStats.favoriteCategory}</Text>
              <Text style={styles.statLabel}>Favorite Category</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <Button
            title="📜 View Certificates"
            onPress={() => console.log('View certificates')}
            variant="secondary"
            size="medium"
            style={styles.quickActionButton}
          />
          <Button
            title="📊 Learning Analytics"
            onPress={() => console.log('View analytics')}
            variant="secondary"
            size="medium"
            style={styles.quickActionButton}
          />
          <Button
            title="⚙️ Account Settings"
            onPress={() => console.log('Account settings')}
            variant="secondary"
            size="medium"
            style={styles.quickActionButton}
          />
          <Button
            title="❓ Help & Support"
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
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
  },
  editButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  profileCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  memberSince: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
  },
  profileInfo: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.GRAY_DARK,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    textAlign: 'center',
    lineHeight: 20,
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.GRAY_DARK,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  statCategory: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    textAlign: 'center',
  },
  actionsCard: {
    marginBottom: 16,
  },
  quickActionButton: {
    marginBottom: 12,
  },
  logoutCard: {
    marginBottom: 16,
  },
  logoutButton: {
    width: '100%',
  },
});
