// types/about.types.ts
export interface AboutStoryResponse {
  story_description: string;
  mission_description: string;
  vision_description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface MissionVisionItem {
  title: string;
  description: string;
  icon: string;
}

// Helper function to split story description into paragraphs
export const splitIntoParagraphs = (text: string): string[] => {
  return text.split('\r\n').filter(para => para.trim() !== '');
};