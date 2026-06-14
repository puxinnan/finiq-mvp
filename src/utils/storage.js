// Auth and User Management
export const getCurrentUser = () => {
  return localStorage.getItem('finIQ_currentUser');
};

export const login = (username, password) => {
  const users = JSON.parse(localStorage.getItem('finIQ_users') || '{}');
  if (users[username] && users[username].password === password) {
    localStorage.setItem('finIQ_currentUser', username);
    return true;
  }
  return false;
};

export const register = (username, password) => {
  const users = JSON.parse(localStorage.getItem('finIQ_users') || '{}');
  if (users[username]) {
    return false; // User exists
  }
  users[username] = { password };
  localStorage.setItem('finIQ_users', JSON.stringify(users));
  localStorage.setItem('finIQ_currentUser', username);
  return true;
};

export const logout = () => {
  localStorage.removeItem('finIQ_currentUser');
};

// Helper for user-specific keys
const getUserKey = (key) => {
  const user = getCurrentUser();
  if (!user) return key; // Fallback to global if no user
  return `finIQ_${user}_${key}`;
};

// User-Specific Data Getters/Setters
export const getTotalScore = () => {
  return parseInt(localStorage.getItem(getUserKey('totalScore')) || '0', 10);
};

export const addScore = (points = 1) => {
  const current = getTotalScore();
  localStorage.setItem(getUserKey('totalScore'), (current + points).toString());
};

export const getMistakes = () => {
  try {
    return JSON.parse(localStorage.getItem(getUserKey('mistakes')) || '[]');
  } catch (e) {
    return [];
  }
};

export const addMistake = (question) => {
  const mistakes = getMistakes();
  // Avoid exact duplicates by checking title
  if (!mistakes.find(m => m.title === question.title)) {
    mistakes.push(question);
    localStorage.setItem(getUserKey('mistakes'), JSON.stringify(mistakes));
  }
};

export const removeMistake = (questionTitle) => {
  let mistakes = getMistakes();
  mistakes = mistakes.filter(m => m.title !== questionTitle);
  localStorage.setItem(getUserKey('mistakes'), JSON.stringify(mistakes));
};

// Game State Storage
export const saveGameState = (gameState) => {
  localStorage.setItem(getUserKey('gameState'), JSON.stringify(gameState));
};

export const loadGameState = () => {
  try {
    const state = localStorage.getItem(getUserKey('gameState'));
    return state ? JSON.parse(state) : null;
  } catch (e) {
    return null;
  }
};

export const clearGameState = () => {
  localStorage.removeItem(getUserKey('gameState'));
};
