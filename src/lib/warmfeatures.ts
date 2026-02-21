export interface WarmFeature {
  heading: string | null;
  description: string | null;
  icon: string | null;
}

export interface WarmSectionResponse {
  heading1: string | null;
  description1: string | null;
  icon1: string | null;
  heading2: string | null;
  description2: string | null;
  icon2: string | null;
  heading3: string | null;
  description3: string | null;
  icon3: string | null;
  heading4: string | null;
  description4: string | null;
  icon4: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to transform API response into array of features
export const transformWarmFeatures = (data: WarmSectionResponse): WarmFeature[] => {
  const features: WarmFeature[] = [];
  
  for (let i = 1; i <= 4; i++) {
    const heading = data[`heading${i}` as keyof WarmSectionResponse];
    const description = data[`description${i}` as keyof WarmSectionResponse];
    const icon = data[`icon${i}` as keyof WarmSectionResponse];
    
    // Only add if at least one field exists (prefer heading as primary indicator)
    if (heading || description || icon) {
      features.push({
        heading: heading || null,
        description: description || null,
        icon: icon || null,
      });
    }
  }
  
  return features;
};
