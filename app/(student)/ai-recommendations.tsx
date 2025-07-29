import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { COLORS } from '@/constants';
import GPTService, { CourseRecommendation } from '@/services/gptService';
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

  const samplePrompts = GPTService.getSamplePrompts() || [];

  const handleGetRecommendations = async () => {
    const validation = GPTService.validatePrompt(prompt);
    if (!validation.valid) {
      Alert.alert('Invalid Prompt', validation.error);
      return;
    }

    setIsLoading(true);
    setShowSamples(false);

    try {
      console.log('🚀 Getting AI recommendations for prompt:', prompt);
      const response = await GPTService.getCourseRecommendations(prompt);
      console.log('📊 GPT Service Response:', response);

      if (response.success && response.data) {
        console.log('✅ Setting recommendations:', response.data.recommendations);
        console.log('📝 AI Response:', response.data.aiResponse);
        console.log('📊 Metadata:', response.data.metadata);
        
        const recommendations = response.data.recommendations || [];
        const aiResponse = response.data.aiResponse || '';
        
        console.log('🔢 Recommendations count:', recommendations.length);
        console.log('📋 Recommendations array:', recommendations);
        
        setRecommendations(recommendations);
        setAiResponse(aiResponse);
        setApiUsage({
          callsUsed: response.data.metadata?.apiCallsUsed || 0,
          remainingCalls: response.data.metadata?.remainingApiCalls || 250,
          maxCalls: 250
        });
        
        // Force show results if we have recommendations
        if (recommendations.length > 0) {
          setShowSamples(false);
          console.log('🎯 Successfully set', recommendations.length, 'recommendations');
        }
      } else {
        console.log('❌ GPT Service failed:', response.error);
        // Show error message for failed AI recommendations
        Alert.alert(
          'AI Service Unavailable',
          'AI recommendations are currently unavailable. The GPT integration is being set up. Would you like to see popular courses instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Show Popular Courses', onPress: handleGetPopularCourses }
          ]
        );
      }
    } catch (error) {
      console.error('💥 Error getting recommendations:', error);
      Alert.alert(
        'Connection Error', 
        'Unable to connect to AI service. Would you like to see popular courses from our catalog instead?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Show Popular Courses', onPress: handleGetPopularCourses }
        ]
      );
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
        const popularAsRecommendations: CourseRecommendation[] = (response.data.courses || []).map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
          instructorName: course.instructorName,
          duration: course.duration,
          price: course.price,
          recommendationReason: `Popular course with ${course.enrollmentCount || 0} enrollments`
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

  // Debug function to test API directly
  const handleTestApiDirect = async () => {
    try {
      console.log('🧪 Testing API directly...');
      
      // First test basic connection
      const connectionTest = await fetch('http://localhost:3000/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🧪 Connection test result:', connectionTest.status);
      
      if (!connectionTest.ok) {
        Alert.alert(
          'Connection Failed',
          `Cannot connect to backend server.\n\nStatus: ${connectionTest.status}\nURL: http://localhost:3000\n\nMake sure your backend server is running!`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Now test the GPT endpoint
      const response = await fetch('http://localhost:3000/api/gpt/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: 'I want to learn web development from scratch' }),
      });
      
      const data = await response.json();
      console.log('🧪 Direct API test result:', data);
      
      Alert.alert(
        'API Test Result',
        `✅ Connection: Success\n📊 Status: ${response.status}\n🎯 Success: ${data.success}\n📚 Recommendations: ${data.data?.recommendations?.length || 0}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('🧪 Direct API test error:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Network request failed - Backend server is not running or not accessible';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Fetch failed - Check if the backend URL is correct';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert(
        'Connection Test Failed',
        `❌ Cannot connect to backend server\n\n🔗 URL: http://localhost:3000\n❌ Error: ${errorMessage}\n\n💡 Solutions:\n1. Make sure backend is running\n2. Check if port 3000 is available\n3. Try restarting your backend server`,
        [{ text: 'OK' }]
      );
    }
  };

  // Debug function to test UI rendering with mock data
  const handleTestUIRender = () => {
    console.log('🎨 Testing UI render with mock data...');
    
    const mockRecommendations: CourseRecommendation[] = [
      {
        id: "test-1",
        title: "Test Course 1",
        description: "This is a test course description",
        category: "Programming",
        level: "Beginner",
        instructorName: "Test Instructor",
        duration: 10,
        price: 29,
        recommendationReason: "Test recommendation reason"
      },
      {
        id: "test-2", 
        title: "Test Course 2",
        description: "Another test course description",
        category: "Web Development",
        level: "Intermediate",
        instructorName: "Another Instructor",
        duration: 15,
        price: 49,
        recommendationReason: "Another test recommendation"
      }
    ];
    
    setRecommendations(mockRecommendations);
    setAiResponse('Test AI response for UI rendering');
    setShowSamples(false);
    setApiUsage({
      callsUsed: 1,
      remainingCalls: 249,
      maxCalls: 250
    });
    
    console.log('🎨 Mock data set successfully');
    Alert.alert('UI Test', 'Mock recommendations have been set. Check if they render correctly.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Course Recommendations</Text>
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
            
            
            
            
            
            {recommendations && recommendations.length > 0 && (
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
        {showSamples && samplePrompts.length > 0 && (
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
        {(() => {
          console.log('🔍 Render check - recommendations:', recommendations);
          console.log('🔍 Render check - recommendations length:', recommendations?.length);
          console.log('🔍 Render check - isLoading:', isLoading);
          console.log('🔍 Render check - showSamples:', showSamples);
          
          return recommendations && recommendations.length > 0 && !isLoading ? (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>
                📚 Recommended Courses ({recommendations.length})
              </Text>
              
              {recommendations.map((course, index) => {
                console.log(`🎯 Rendering course ${index + 1}:`, course.title);
                return (
                  <Card key={course.id || index} style={styles.courseCard}>
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
                        onPress={() => {
                          // Navigate to course details (you may need to implement this route)
                          Alert.alert(
                            'Course Details',
                            `Viewing details for "${course.title}"\n\n${course.description}`,
                            [{ text: 'OK' }]
                          );
                        }}
                        variant="secondary"
                        size="small"
                        style={styles.detailsButton}
                      />
                      <Button
                        title="Enroll Now"
                        onPress={() => {
                          Alert.alert(
                            'Enroll in Course',
                            `Would you like to enroll in "${course.title}"?\n\nPrice: $${course.price}\nDuration: ${course.duration} hours`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { 
                                text: 'Enroll', 
                                onPress: () => {
                                  Alert.alert('Success!', 'You have been enrolled in the course.');
                                }
                              }
                            ]
                          );
                        }}
                        size="small"
                        style={styles.enrollButton}
                      />
                    </View>
                  </Card>
                );
              })}
            </View>
          ) : null;
        })()}

        {/* Empty State */}
        {(() => {
          const shouldShowEmpty = !isLoading && (!recommendations || recommendations.length === 0) && !showSamples;
          console.log('🔍 Empty state check:', {
            isLoading,
            recommendationsLength: recommendations?.length || 0,
            showSamples,
            shouldShowEmpty
          });
          
          return shouldShowEmpty ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                🔍 No recommendations yet
              </Text>
              <Text style={styles.emptySubtext}>
                Describe your learning goals above to get personalized course recommendations
              </Text>
            </Card>
          ) : null;
        })()}
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
    flexWrap: 'wrap',
  },
  recommendButton: {
    flex: 2,
  },
  testButton: {
    minWidth: 80,
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
