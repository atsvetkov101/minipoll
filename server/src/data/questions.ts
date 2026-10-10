export interface Question {
  id: number;
  text: string;
  options: string[];
}

export const QUESTIONS: Question[] = [
  { id: 1, text: 'Как вас зовут?', options: [] },
  { id: 2, text: 'Какой у вас опыт работы с AI-инструментами?', options: ['Нет опыта', 'Пробовал пару раз', 'Использую регулярно', 'Использую каждый день'] },
  { id: 3, text: 'Какой стек вы предпочитаете?', options: ['TypeScript', 'Python', 'Go', 'Другое'] },
  { id: 4, text: 'Готовы ли вы рекомендовать AI-ассистенты коллегам?', options: ['Да', 'Нет', 'Пока не уверен'] },
];
