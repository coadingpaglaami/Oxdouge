// types/work.types.ts
export interface WorkItem {
  id: number;
  icon: string | null;
  title: string;
  description: string;
  created_at: string;
}

export interface WorkResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WorkItem[];
}

// Helper function to get step number based on index
export const getStepNumber = (index: number): string => {
  return (index + 1).toString().padStart(2, '0');
};