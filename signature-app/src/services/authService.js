// src/services/authService.js
const databaseUrl = '/path/to/database.json'; // Atualize com o caminho correto

export const login = async (username, password) => {
  const response = await fetch(databaseUrl);
  const data = await response.json();
  const user = data.users.find(user => user.username === username && user.password === password);

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } else {
    throw new Error('Usuário ou senha incorretos.');
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
