import { QUESTIONS, type Question } from './data/questions.js';

export interface AnswerRecord {
  questionId: number;
  answer: string;
}

export interface Submission {
  id: number;
  answers: AnswerRecord[];
  submittedAt: string;
}

export interface ValidationResult {
  ok: true;
  answers: AnswerRecord[];
}

export interface ValidationFailure {
  ok: false;
  error: string;
}

export type ValidationOutcome = ValidationResult | ValidationFailure;

const answers: Submission[] = [];
let nextId = 1;

export function getAnswers(): Submission[] {
  return answers;
}

export function addSubmission(record: Submission): void {
  answers.push(record);
}

export function createSubmission(record: Omit<Submission, 'id' | 'submittedAt'>): Submission {
  return {
    ...record,
    id: nextId++,
    submittedAt: new Date().toISOString(),
  };
}

export function validateSubmission(body: unknown): ValidationOutcome {
  if (body === null || typeof body !== 'object') {
    return { ok: false, error: 'Body must be a JSON object' };
  }

  const { answers: answersField } = body as { answers?: unknown };
  if (!Array.isArray(answersField) || answersField.length === 0) {
    return { ok: false, error: 'Field "answers" must be a non-empty array' };
  }

  const validated: AnswerRecord[] = [];
  for (const item of answersField) {
    if (item === null || typeof item !== 'object') {
      return { ok: false, error: 'Each answer must be an object' };
    }

    const { questionId, answer } = item as { questionId?: unknown; answer?: unknown };
    if (typeof questionId !== 'number' || !Number.isInteger(questionId)) {
      return { ok: false, error: 'Field "questionId" must be an integer' };
    }

    if (typeof answer !== 'string' || answer.trim().length === 0) {
      return { ok: false, error: 'Field "answer" must be a non-empty string' };
    }

    const question: Question | undefined = QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      return { ok: false, error: `Unknown questionId: ${questionId}` };
    }

    if (question.options.length > 0 && !question.options.includes(answer)) {
      return { ok: false, error: `Answer "${answer}" is not a valid option for question ${questionId}` };
    }

    validated.push({ questionId, answer });
  }

  return { ok: true, answers: validated };
}
