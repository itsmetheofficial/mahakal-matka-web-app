let endingSession = false;

export function endSession(message = '') {
  if (endingSession) return;
  endingSession = true;
  localStorage.clear();
  sessionStorage.clear();
  if (message) sessionStorage.setItem('logoutMessage', message);
  document.title = 'Mahakal Matka';
  window.location.replace('/auth/login');
}
