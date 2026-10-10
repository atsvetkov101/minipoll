import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AppService } from './app.service.js';

test('returns the list of questions', () => {
  const service = new AppService();
  const questions = service.getQuestions();
  assert.ok(questions.length >= 3 && questions.length <= 5);
});

test('accepts valid answers and stores them in memory', () => {
  const service = new AppService();
  const submission = service.submitAnswers({
    answers: [
      { questionId: 1, answer: 'Иван' },
      { questionId: 2, answer: 'Пробовал пару раз' },
    ],
  });
  assert.equal(submission.id, 1);
  assert.equal(service.getSubmissions().length, 1);
});

test('rejects unknown questionId', () => {
  const service = new AppService();
  assert.throws(
    () => service.submitAnswers({ answers: [{ questionId: 99, answer: 'x' }] }),
    /Unknown questionId/,
  );
});

test('rejects empty answers array', () => {
  const service = new AppService();
  assert.throws(
    () => service.submitAnswers({ answers: [] }),
    /non-empty array/,
  );
});
