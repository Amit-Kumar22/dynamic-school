export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  return !!token;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/';
  }
};

export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
  }
};
