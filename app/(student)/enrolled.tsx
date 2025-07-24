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
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function EnrolledCoursesScreen() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: '1',
      title: 'React Native Complete Guide',
      instructor: 'John Doe',
      progress: 45,
      totalLessons: 24,
      completedLessons: 11,
      lastAccessed: '2 days ago',
      status: 'active',
      nextLesson: 'State Management with Redux',
      estimatedTime: '2h 30m remaining',
    },
    {
      id: '2',
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Johnson',
      progress: 100,
      totalLessons: 18,
      completedLessons: 18,
      lastAccessed: '1 week ago',
      status: 'completed',
      certificate: true,
      completedDate: 'March 15, 2024',
    },
    {
      id: '3',
      title: 'JavaScript ES6+ Features',
      instructor: 'Sarah Wilson',
      progress: 78,
      totalLessons: 15,
      completedLessons: 12,
      lastAccessed: '1 day ago',
      status: 'active',
      nextLesson: 'Async/Await and Promises',
      estimatedTime: '45m remaining',
    },
  ];

  const activeCourses = enrolledCourses.filter(course => course.status === 'active');
  const completedCourses = enrolledCourses.filter(course => course.status === 'completed');

  const continueCourse = (courseId: string, courseTitle: string) => {
    console.log(`Continuing course: ${courseTitle}`);
    // Navigate to course content
  };

  const downloadCertificate = (courseId: string, courseTitle: string) => {
    console.log(`Downloading certificate for: ${courseTitle}`);
    // Download certificate functionality
  };

  const renderProgressBar = (progress: number) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );

  const renderCourseCard = (course: any) => (
    <Card key={course.id} style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        {course.status === 'completed' && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </View>
        )}
      </View>

      <Text style={styles.instructorText}>by {course.instructor}</Text>

      {renderProgressBar(course.progress)}

      <View style={styles.courseStats}>
        <Text style={styles.statText}>
          {course.completedLessons}/{course.totalLessons} lessons completed
        </Text>
        <Text style={styles.statText}>
          Last accessed: {course.lastAccessed}
        </Text>
      </View>

      {course.status === 'active' ? (
        <View style={styles.activeActions}>
          <Text style={styles.nextLessonText}>
            Next: {course.nextLesson}
          </Text>
          <Text style={styles.timeText}>
            {course.estimatedTime}
          </Text>
          <Button
            title="Continue Learning"
            onPress={() => continueCourse(course.id, course.title)}
            size="medium"
            style={styles.continueButton}
          />
        </View>
      ) : (
        <View style={styles.completedActions}>
          <Text style={styles.completedDateText}>
            Completed on {course.completedDate}
          </Text>
          {course.certificate && (
            <Button
              title="📜 Download Certificate"
              onPress={() => downloadCertificate(course.id, course.title)}
              variant="secondary"
              size="medium"
              style={styles.certificateButton}
            />
          )}
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Courses</Text>
        <Text style={styles.subtitle}>Track your learning progress</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'active' && styles.tabButtonActive
          ]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'active' && styles.tabTextActive
          ]}>
            Active ({activeCourses.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'completed' && styles.tabButtonActive
          ]}
          onPress={() => setSelectedTab('completed')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'completed' && styles.tabTextActive
          ]}>
            Completed ({completedCourses.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedTab === 'active' ? (
          activeCourses.length > 0 ? (
            activeCourses.map(renderCourseCard)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No active courses found
              </Text>
              <Text style={styles.emptySubtext}>
                Start learning by browsing available courses!
              </Text>
            </Card>
          )
        ) : (
          completedCourses.length > 0 ? (
            completedCourses.map(renderCourseCard)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No completed courses yet
              </Text>
              <Text style={styles.emptySubtext}>
                Complete your active courses to see them here!
              </Text>
            </Card>
          )
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
  header: {
    padding: 16,
    paddingBottom: 8,
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
  },
  tabButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.GRAY_MEDIUM,
  },
  tabTextActive: {
    color: COLORS.WHITE,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
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
  completedBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  instructorText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    minWidth: 35,
  },
  courseStats: {
    marginBottom: 16,
  },
  statText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 4,
  },
  activeActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
    paddingTop: 16,
  },
  nextLessonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.GRAY_DARK,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 12,
  },
  continueButton: {
    alignSelf: 'flex-start',
  },
  completedActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_LIGHT,
    paddingTop: 16,
  },
  completedDateText: {
    fontSize: 14,
    color: COLORS.GRAY_MEDIUM,
    marginBottom: 12,
  },
  certificateButton: {
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
