import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly submissions: Submission[] = [];
  private nextId = 1;

  getQuestions(): Question[] {
    return QUESTIONS;
  }

  getSubmissions(): Submission[] {
    return this.submissions;
  }

  submitAnswers(body: unknown): Submission {
    const answers = this.validateSubmission(body);
    const submission: Submission = {
      id: this.nextId++,
      answers,
      submittedAt: new Date().toISOString(),
    };
    this.submissions.push(submission);
    this.logger.log(`Total submissions stored: ${this.submissions.length}`);
    return submission;
  }

  private validateSubmission(body: unknown): AnswerRecord[] {
    if (body === null || typeof body !== 'object') {
      throw new BadRequestException('Body must be a JSON object');
    }

    const { answers: answersField } = body as { answers?: unknown };
    if (!Array.isArray(answersField) || answersField.length === 0) {
      throw new BadRequestException('Field "answers" must be a non-empty array');
    }

    const validated: AnswerRecord[] = [];
    for (const item of answersField) {
      if (item === null || typeof item !== 'object') {
        throw new BadRequestException('Each answer must be an object');
      }

      const { questionId, answer } = item as { questionId?: unknown; answer?: unknown };
      if (typeof questionId !== 'number' || !Number.isInteger(questionId)) {
        throw new BadRequestException('Field "questionId" must be an integer');
      }

      if (typeof answer !== 'string' || answer.trim().length === 0) {
        throw new BadRequestException('Field "answer" must be a non-empty string');
      }

      const question: Question | undefined = QUESTIONS.find((q) => q.id === questionId);
      if (!question) {
        throw new BadRequestException(`Unknown questionId: ${questionId}`);
      }

      if (question.options.length > 0 && !question.options.includes(answer)) {
        throw new BadRequestException(
          `Answer "${answer}" is not a valid option for question ${questionId}`,
        );
      }

      validated.push({ questionId, answer });
    }

    return validated;
  }
}
