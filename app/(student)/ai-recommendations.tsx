import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { COLORS } from '@/constants';
import GPTService, { CourseRecommendation } from '@/services/gptService';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function AIRecommendationsScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [apiUsage, setApiUsage] = useState<{
    callsUsed: number;
    remainingCalls: number;
    maxCalls: number;
  } | null>(null);
  const [showSamples, setShowSamples] = useState(true);

  const samplePrompts = GPTService.getSamplePrompts();

  const handleGetRecommendations = async () => {
    const validation = GPTService.validatePrompt(prompt);
    if (!validation.valid) {
      Alert.alert('Invalid Prompt', validation.error);
      return;
    }

    setIsLoading(true);
    setShowSamples(false);

    try {
      const response = await GPTService.getCourseRecommendations(prompt);

      if (response.success && response.data) {
        setRecommendations(response.data.recommendations);
        setAiResponse(response.data.aiResponse);
        setApiUsage({
          callsUsed: response.data.metadata.apiCallsUsed,
          remainingCalls: response.data.metadata.remainingApiCalls,
          maxCalls: 250
        });
      } else {
        // Fallback to popular courses
        Alert.alert(
          'AI Unavailable',
          'AI recommendations are temporarily unavailable. Showing popular courses instead.',
          [
            { text: 'OK', onPress: handleGetPopularCourses }
          ]
        );
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      Alert.alert('Error', 'Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPopularCourses = async () => {
    setIsLoading(true);

    try {
      const response = await GPTService.getPopularCourses();

      if (response.success && response.data) {
        // Convert popular courses to recommendation format
        const popularAsRecommendations: CourseRecommendation[] = response.data.courses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
          instructorName: course.instructorName,
          duration: course.duration,
          price: course.price,
          recommendationReason: `Popular course with ${course.enrollmentCount} enrollments`
        }));

        setRecommendations(popularAsRecommendations);
        setAiResponse('Here are some popular courses from our catalog:');
      } else {
        Alert.alert('Error', 'Failed to load courses. Please try again.');
      }
    } catch (error) {
      console.error('Error getting popular courses:', error);
      Alert.alert('Error', 'Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
    setShowSamples(false);
  };

  const handleClearResults = () => {
    setRecommendations([]);
    setAiResponse('');
    setPrompt('');
    setShowSamples(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🤖 AI Course Recommendations</Text>
          <Text style={styles.subtitle}>
            Describe your career goals and let AI recommend the perfect courses for you
          </Text>
          
          {apiUsage && (
            <View style={styles.usageContainer}>
              <Text style={styles.usageText}>
                API Usage: {apiUsage.callsUsed}/{apiUsage.maxCalls} calls used
              </Text>
              <View style={styles.usageBar}>
                <View 
                  style={[
                    styles.usageBarFill, 
                    { width: `${(apiUsage.callsUsed / apiUsage.maxCalls) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Input Section */}
        <Card style={styles.inputCard}>
          <Text style={styles.cardTitle}>Tell us about your goals</Text>
          
          <Input
            label="What do you want to learn?"
            value={prompt}
            onChangeText={setPrompt}
            placeholder="e.g., I want to become a full-stack developer..."
            multiline
            numberOfLines={3}
            style={styles.promptInput}
          />

          <View style={styles.inputActions}>
            <Button
              title={isLoading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
              onPress={handleGetRecommendations}
              disabled={isLoading || !prompt.trim()}
              style={styles.recommendButton}
            />
            
            {recommendations.length > 0 && (
              <Button
                title="Clear Results"
                onPress={handleClearResults}
                variant="secondary"
                style={styles.clearButton}
              />
            )}
          </View>

          {/* Character count */}
          <Text style={styles.charCount}>
            {prompt.length}/500 characters
          </Text>
        </Card>

        {/* Sample Prompts */}
        {showSamples && (
          <Card style={styles.samplesCard}>
            <Text style={styles.cardTitle}>💡 Try these sample prompts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.samplesContainer}>
                {samplePrompts.slice(0, 5).map((sample, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.sampleButton}
                    onPress={() => handleUseSamplePrompt(sample)}
                  >
                    <Text style={styles.sampleText}>{sample}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>
              🤖 AI is analyzing your goals and finding the best courses...
            </Text>
          </Card>
        )}

        {/* AI Response */}
        {aiResponse && !isLoading && (
          <Card style={styles.responseCard}>
            <Text style={styles.cardTitle}>🎯 AI Learning Path</Text>
            <Text style={styles.aiResponseText}>{aiResponse}</Text>
          </Card>
        )}

        {/* Course Recommendations */}
        {recommendations.length > 0 && !isLoading && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>
              📚 Recommended Courses ({recommendations.length})
            </Text>
            
            {recommendations.map((course) => (
              <Card key={course.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>${course.price}</Text>
                  </View>
                </View>

                <Text style={styles.instructorText}>by {course.instructorName}</Text>
                
                <View style={styles.courseMetadata}>
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Category:</Text>
                    <Text style={styles.metadataValue}>{course.category}</Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Level:</Text>
                    <Text style={styles.metadataValue}>{course.level}</Text>
                  </View>
                  <View style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Duration:</Text>
                    <Text style={styles.metadataValue}>{course.duration} hours</Text>
                  </View>
                </View>

                <Text style={styles.courseDescription}>{course.description}</Text>

                <View style={styles.recommendationReason}>
                  <Text style={styles.reasonLabel}>💡 Why recommended:</Text>
                  <Text style={styles.reasonText}>{course.recommendationReason}</Text>
                </View>

                <View style={styles.courseActions}>
                  <Button
                    title="View Details"
                    onPress={() => router.push(`./course-details?id=${course.id}`)}
                    variant="secondary"
                    size="small"
                    style={styles.detailsButton}
                  />
                  <Button
                    title="Enroll Now"
                    onPress={() => {
                      Alert.alert(
                        'Enroll in Course',
                        `Would you like to enroll in "${course.title}"?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Enroll', onPress: () => console.log('Enrolling...') }
                        ]
                      );
                    }}
                    size="small"
                    style={styles.enrollButton}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!isLoading && !recommendations.length && !showSamples && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              🔍 No recommendations yet
            </Text>
            <Text style={styles.emptySubtext}>
              Describe your learning goals above to get personalized course recommendations
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    marginBottom: 16,
  },
  usageContainer: {
    marginTop: 12,
  },
  usageText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginBottom: 4,
  },
  usageBar: {
    height: 4,
    backgroundColor: COLORS.BORDER,
    borderRadius: 2,
  },
  usageBarFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  inputCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 16,
  },
  promptInput: {
    marginBottom: 16,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  recommendButton: {
    flex: 2,
  },
  clearButton: {
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    textAlign: 'right',
  },
  samplesCard: {
    marginBottom: 20,
  },
  samplesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sampleButton: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    padding: 12,
    borderRadius: 12,
    maxWidth: 250,
  },
  sampleText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  loadingCard: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_MUTED,
    marginTop: 16,
    textAlign: 'center',
  },
  responseCard: {
    marginBottom: 20,
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  aiResponseText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
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
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  instructorText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    marginBottom: 12,
  },
  courseMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metadataItem: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    fontWeight: '600',
  },
  metadataValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationReason: {
    backgroundColor: COLORS.ACCENT,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.WHITE,
    lineHeight: 18,
  },
  courseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
  },
  enrollButton: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
});
