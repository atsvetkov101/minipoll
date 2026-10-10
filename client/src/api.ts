import type { AnswerRecord, Question } from './types';

export async function fetchQuestions(): Promise<Question[]> {
  const res = await fetch('/questions');
  if (!res.ok) {
    throw new Error(`Не удалось загрузить вопросы (HTTP ${res.status})`);
  }
  return res.json() as Promise<Question[]>;
}

export async function submitAnswers(answers: AnswerRecord[]): Promise<void> {
  const res = await fetch('/answers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    throw new Error(`Не удалось отправить ответы (HTTP ${res.status})`);
  }
}
