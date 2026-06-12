export const getTotalScore = () => {
  return parseInt(localStorage.getItem('finIQ_totalScore') || '0', 10);
};

export const addScore = (points = 1) => {
  const current = getTotalScore();
  localStorage.setItem('finIQ_totalScore', (current + points).toString());
};

export const getMistakes = () => {
  try {
    return JSON.parse(localStorage.getItem('finIQ_mistakes') || '[]');
  } catch (e) {
    return [];
  }
};

export const addMistake = (question) => {
  const mistakes = getMistakes();
  // Avoid exact duplicates by checking title
  if (!mistakes.find(m => m.title === question.title)) {
    mistakes.push(question);
    localStorage.setItem('finIQ_mistakes', JSON.stringify(mistakes));
  }
};

export const removeMistake = (questionTitle) => {
  let mistakes = getMistakes();
  mistakes = mistakes.filter(m => m.title !== questionTitle);
  localStorage.setItem('finIQ_mistakes', JSON.stringify(mistakes));
};
