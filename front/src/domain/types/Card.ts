export interface Card {
    id: string;
    question: string;
    answer: string;
    category: number;
    tags: string[];
    createdAt: string;
    lastReviewedAt: string | null;
}

export interface CreateCardDTO { 
    question: string;
    answer: string;
    tags?: string[];
}

export interface ReviewCardDTO {
    newCategory: number;
}

export interface GetCardsFilters {
    category?: number;
    tags?: string[];
    fromDate?: string;
    toDate?: string;
}

export interface GetQuizzParams {
    date?: string;
}
