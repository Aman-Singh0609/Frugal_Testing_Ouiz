const ALL_QUESTIONS = [
  { id: 1, category: 'General', difficulty: 'easy', q: 'What is 2 + 1?', options: ['1', '2', '3', '4'], answer: 2 },
  { id: 2, category: 'General', difficulty: 'easy', q: 'Which is a primary color?', options: ['Green', 'Black', 'Red', 'Cyan'], answer: 2 },
  { id: 3, category: 'Math', difficulty: 'medium', q: 'What is 7 × 6?', options: ['42', '36', '48', '40'], answer: 0 },
  { id: 4, category: 'Science', difficulty: 'hard', q: 'Which gas is most abundant in the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'], answer: 1 },
  { id: 5, category: 'General', difficulty: 'medium', q: 'HTML stands for?', options: ['Hyper Text Markup Language','High Text Markup Language','Hyperlinks Text Mark Language','None of these'], answer: 0 },
  { id: 6, category: 'Math', difficulty: 'easy', q: 'What is 3?', options: ['1','2','3','0'], answer: 2 },
  { id: 7, category: 'Science', difficulty: 'medium', q: 'Water has pH roughly?', options: ['1','7','14','10'], answer: 1 }
];

function getCategories(){
  return Array.from(new Set(ALL_QUESTIONS.map(q => q.category)));
}

function fetchQuestions(category, difficulty, count){
  let pool = ALL_QUESTIONS.filter(q => q.category === category && q.difficulty === difficulty);
  if(pool.length < count){
    pool = ALL_QUESTIONS.filter(q => q.category === category);
  }
  // fallback to all questions if still not enough
  if(pool.length < count) pool = ALL_QUESTIONS.slice();
  return shuffle(pool).slice(0, count);
}

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
