export interface MoodAnalysis {
  overallMoodTrend: {
    summary: string;
    highPoints: string[];
    lowPoints: string[];
  };
  patternsAndTriggers: {
    recurringThemes: string[];
    moodTriggers: string[];
    correlations: string[];
  };
  insights: {
    keyObservations: string[];
    moodActivityRelationships: string[];
  };
  suggestions: string[];
  friendlySummary: string;
}