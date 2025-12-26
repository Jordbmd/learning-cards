import { Category } from './Category';

export interface Card {
    id: string;
    question: string;
    answer: string;
    category: Category;
    tag?: string;
}

export interface CreateCardDTO { 
    question: string;
    answer: string;
    tag?: string;
}

export interface GetCardsFilters {
    tags?: string[];
}

export interface GetQuizzParams {
    date?: string;
}

export interface AnswerCardDTO {
    isValid: boolean;
}
