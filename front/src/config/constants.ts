export const API_BASE_URL = 'http://localhost:8080';

export const CARD_CATEGORIES = {
    MIN: 1,
    MAX: 7,
} as const;

export const QUIZZ_CONFIG = {
    CARDS_PER_SESSION: 5,
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

