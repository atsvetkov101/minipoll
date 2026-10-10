export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface AnswerRecord {
  questionId: number;
  answer: string;
}
