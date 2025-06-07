export interface UserProfileRequest {
  user_id: string;
  usage: string;
  budget: string;
  experience: string;
  priority: string;
  portability: string;
  gaming: string;
  software: string[];
}

export interface RecommendationResponse {
  products: Array<{
    id: string;
    name: string;
    price: number;
    discount?: number;
    rating?: number;
    category: string[];
    images: string[];
    specs: Record<string, string>;
    stock: number;
    usage: string[];
    description: string;
    matchPercentage: number;
    whyRecommended: string[];
  }>;
  userProfile: {
    user_id: string;
    usage: string;
    budget: string;
    experience: string;
    priority: string;
    portability: string;
    gaming: string;
    software: string[];
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  totalMatches: number;
}

export interface FormData {
  usage: string;
  budget: string;
  experience: string;
  priority: string;
  portability: string;
  gaming: string;
  software: string[];
}

export interface QuestionAnswer {
  [key: string]: string | string[];
}

export interface FeedbackRequest {
  user_id: string;
  product_id: string;
  recommendation_id?: string;
  feedback_type: 'like' | 'dislike' | 'purchased' | 'not_interested';
  rating?: number;
  comment?: string;
}