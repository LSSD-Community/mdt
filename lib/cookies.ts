export function setClientCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString(); // 864e5 = 1 jour en ms
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}


export function getClientCookie(name: string): string | null {
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

