export interface CardProps {
  id: string;
  question: string;
  answer: string;
  category: number;
  tags: string[];
  createdAt: Date;
  lastReviewedAt: Date | null;
}

export default class Card {
  private props: CardProps;

  constructor(props: CardProps) {
    this.validate(props);
    this.props = props;
  }

  getId(): string {
    return this.props.id;
  }

  getQuestion(): string {
    return this.props.question;
  }

  getAnswer(): string {
    return this.props.answer;
  }

  getCategory(): number {
    return this.props.category;
  }

  getTags(): string[] {
    return this.props.tags;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getLastReviewedAt(): Date | null {
    return this.props.lastReviewedAt;
  }

  moveToCategory(newCategory: number): void {
    this.validateCategory(newCategory);
    this.props.category = newCategory;
    this.props.lastReviewedAt = new Date();
  }

  updateQuestion(newQuestion: string): void {
    const trimmedQuestion = newQuestion?.trim();
    if (!trimmedQuestion) {
      throw new Error('Card question is required');
    }
    this.props.question = trimmedQuestion;
  }

  updateAnswer(newAnswer: string): void {
    const trimmedAnswer = newAnswer?.trim();
    if (!trimmedAnswer) {
      throw new Error('Card answer is required');
    }
    this.props.answer = trimmedAnswer;
  }

  resetToCategory1(): void {
    this.props.category = 1;
    this.props.lastReviewedAt = new Date();
  }

  addTag(tag: string): void {
    const trimmedTag = tag.trim();
    if (!trimmedTag) {
      throw new Error('Tag cannot be empty');
    }
    if (!this.props.tags.includes(trimmedTag)) {
      this.props.tags.push(trimmedTag);
    }
  }

  removeTag(tag: string): void {
    this.props.tags = this.props.tags.filter(t => t !== tag);
  }

  hasTag(tag: string): boolean {
    return this.props.tags.includes(tag);
  }

  isInFinalCategory(): boolean {
    return this.props.category === 7;
  }

  answerCorrectly(): void {
    if (this.props.category >= 7) {
      this.props.category = 8;
    } else {
      this.props.category += 1;
    }
    this.props.lastReviewedAt = new Date();
  }

  answerIncorrectly(): void {
    this.props.category = 1;
    this.props.lastReviewedAt = new Date();
  }

  isDone(): boolean {
    return this.props.category === 8;
  }

  private validate(props: CardProps): void {
    if (!props.id?.trim()) {
      throw new Error('Card id is required');
    }
    if (!props.question?.trim()) {
      throw new Error('Card question is required');
    }
    if (!props.answer?.trim()) {
      throw new Error('Card answer is required');
    }
    this.validateCategory(props.category);
  }

  private validateCategory(category: number): void {
    if (!Number.isInteger(category) || category < 1 || category > 8) {
      throw new Error('Card category must be between 1 and 8');
    }
  }
}
