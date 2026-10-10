import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { fetchQuestions, submitAnswers } from './api';
import type { AnswerRecord, Question } from './types';

type Status = 'loading' | 'ready' | 'submitting' | 'done';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions()
      .then((loaded) => {
        setQuestions(loaded);
        setStatus('ready');
      })
      .catch((err: Error) => {
        setError(err.message);
        setStatus('ready');
      });
  }, []);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const missing = questions.find((q) => {
      const value = answers[q.id];
      return value === undefined || value.trim().length === 0;
    });
    if (missing) {
      setError('Ответьте на все вопросы');
      return;
    }

    setStatus('submitting');
    try {
      const payload: AnswerRecord[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id],
      }));
      await submitAnswers(payload);
      setStatus('done');
    } catch (err) {
      setError((err as Error).message);
      setStatus('ready');
    }
  };

  if (status === 'loading') {
    return <p className="state">Загрузка вопросов…</p>;
  }

  if (status === 'done') {
    return <h1 className="state">Спасибо!</h1>;
  }

  return (
    <main className="container">
      <h1>Мини-анкета</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <fieldset key={question.id}>
            <legend>
              {question.id}. {question.text}
            </legend>
            {question.options.length > 0 ? (
              question.options.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleAnswer(question.id, option)}
                  />
                  {option}
                </label>
              ))
            ) : (
              <input
                type="text"
                value={answers[question.id] ?? ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
              />
            )}
          </fieldset>
        ))}
        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Отправка…' : 'Отправить'}
        </button>
      </form>
    </main>
  );
}
