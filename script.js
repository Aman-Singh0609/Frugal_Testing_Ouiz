// Elements
const categoryEl = document.getElementById('category');
const difficultyEl = document.getElementById('difficulty');
const questionsCountEl = document.getElementById('questionsCount');
const startBtn = document.getElementById('startBtn');
const landing = document.getElementById('landing');
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
const timerEl = document.getElementById('timer');
const qIndexEl = document.getElementById('qIndex');
const qTotalEl = document.getElementById('qTotal');
const questionArea = document.getElementById('questionArea');
const optionsArea = document.getElementById('optionsArea');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const restartBtn = document.getElementById('restart');
const summary = document.getElementById('summary');
const pieCanvas = document.getElementById('pieChart');
const timeCanvas = document.getElementById('timeChart');

let quizQuestions = [];
let answers = [];
let current = 0;
let perQuestionTime = 20; // seconds
let timerId = null;
let timeSpent = [];
let startTime = null;

function init(){
  // populate categories
  const categories = getCategories();
  categoryEl.innerHTML = '';
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoryEl.appendChild(opt);
  });
  // event listeners
  startBtn.addEventListener('click', startQuiz);
  prevBtn.addEventListener('click', prevQuestion);
  nextBtn.addEventListener('click', nextQuestion);
  submitBtn.addEventListener('click', submitQuiz);
  restartBtn.addEventListener('click', restart);
}

function startQuiz(){
  const cat = categoryEl.value;
  if(!cat){
    alert('Please select a category.');
    return;
  }
  const diff = difficultyEl.value;
  const count = Math.max(1, Math.min(20, parseInt(questionsCountEl.value, 10) || 5));
  quizQuestions = fetchQuestions(cat, diff, count);
  answers = new Array(quizQuestions.length).fill(null);
  timeSpent = new Array(quizQuestions.length).fill(0);
  current = 0;
  qTotalEl.textContent = quizQuestions.length;
  landing.classList.add('hidden');
  result.classList.add('hidden');
  quiz.classList.remove('hidden');
  renderQuestion();
}

function renderQuestion(){
  clearInterval(timerId);
  const q = quizQuestions[current];
  qIndexEl.textContent = current + 1;
  questionArea.textContent = q.q;
  optionsArea.innerHTML = '';
  q.options.forEach((opt, i) => {
    const d = document.createElement('div');
    d.className = 'option';
    d.dataset.index = i;
    d.textContent = opt;
    d.addEventListener('click', () => selectOption(i));
    if(answers[current] === i) d.classList.add('selected');
    optionsArea.appendChild(d);
  });
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === quizQuestions.length - 1;
  submitBtn.disabled = false;
  startTimer(perQuestionTime);
  startTime = Date.now();
}

function selectOption(i){
  answers[current] = i;
  Array.from(optionsArea.children).forEach(c => c.classList.remove('selected'));
  const el = optionsArea.querySelector(`.option[data-index="${i}"]`);
  if(el) el.classList.add('selected');
}

function startTimer(seconds){
  let s = seconds;
  updateTimer(s);
  timerId = setInterval(() => {
    s--;
    updateTimer(s);
    if(s <= 0){
      handleTimeUp();
    }
  }, 1000);
}

function updateTimer(s){
  if(s < 0) s = 0;
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;
}

function handleTimeUp(){
  clearInterval(timerId);
  const spent = Math.round((Date.now() - startTime) / 1000);
  timeSpent[current] += spent || perQuestionTime;
  if(current < quizQuestions.length - 1){
    current++;
    renderQuestion();
  } else {
    submitQuiz();
  }
}

function prevQuestion(){
  clearInterval(timerId);
  const spent = Math.round((Date.now() - startTime) / 1000);
  timeSpent[current] += spent || 0;
  if(current > 0) current--;
  renderQuestion();
}

function nextQuestion(){
  clearInterval(timerId);
  const spent = Math.round((Date.now() - startTime) / 1000);
  timeSpent[current] += spent || 0;
  if(current < quizQuestions.length - 1) current++;
  renderQuestion();
}

function submitQuiz(){
  clearInterval(timerId);
  const spent = Math.round((Date.now() - startTime) / 1000);
  timeSpent[current] += spent || 0;
  quiz.classList.add('hidden');
  result.classList.remove('hidden');
  calculateResults();
}

function calculateResults(){
  let right = 0, wrong = 0;
  quizQuestions.forEach((q, i) => {
    if(answers[i] === null) wrong++;
    else if(answers[i] === q.answer) right++;
    else wrong++;
  });
  const total = quizQuestions.length;
  const percent = Math.round((right / total) * 100);
  summary.innerHTML = `<p><strong>Correct:</strong> ${right} &nbsp;&nbsp; <strong>Incorrect:</strong> ${wrong} &nbsp;&nbsp; <strong>Score:</strong> ${percent}%</p>`;
  renderPerQuestionList();
  renderCharts(right, wrong);
}

function renderPerQuestionList(){
  const div = document.createElement('div');
  div.innerHTML = '<h3>Per-question details</h3>';
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.innerHTML = `<thead><tr style="text-align:left"><th>#</th><th>Question</th><th>Your Answer</th><th>Correct</th><th>Seconds</th></tr></thead><tbody></tbody>`;
  const tbody = table.querySelector('tbody');
  quizQuestions.forEach((q, i) => {
    const your = answers[i] === null ? '-' : q.options[answers[i]];
    const correct = q.options[q.answer];
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${q.q}</td><td>${your}</td><td>${correct}</td><td>${timeSpent[i]}</td>`;
    tbody.appendChild(tr);
  });
  div.appendChild(table);
  summary.appendChild(div);
}

function renderCharts(right, wrong){
  // pie
  if(window.pieChartInstance) window.pieChartInstance.destroy();
  window.pieChartInstance = new Chart(pieCanvas.getContext('2d'), {
    type: 'pie',
    data: { labels: ['Correct', 'Incorrect'], datasets: [{ data: [right, wrong] }] },
    options: { responsive: true }
  });
  // time bar
  const labels = quizQuestions.map((_, i) => `Q${i+1}`);
  if(window.timeChartInstance) window.timeChartInstance.destroy();
  window.timeChartInstance = new Chart(timeCanvas.getContext('2d'), {
    type: 'bar',
    data: { labels: labels, datasets: [{ label: 'Seconds spent', data: timeSpent }] },
    options: { scales: { y: { beginAtZero: true } }, responsive: true }
  });
}

function restart(){
  result.classList.add('hidden');
  landing.classList.remove('hidden');
  // reset UI
  categoryEl.selectedIndex = 0;
  difficultyEl.value = 'easy';
  questionsCountEl.value = 5;
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});
