const API_URL = 'https://api.mdt.lssd-community.cozedev.com';

export async function getAuthToken(username: string, password: string): Promise<string> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/sessions/login`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Identifiants incorrects');
        }
        if (response.status === 403) {
            throw new Error('Accès interdit : votre compte a été banni');
        }
        throw new Error(`Échec de la connexion : ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.access_token) {
        throw new Error('Échec de la connexion : aucun jeton reçu');
    }

    return data.access_token;
}


export async function login(username: string, password: string): Promise<void> {
    const token = await getAuthToken(username, password);
    localStorage.setItem('authToken', token);
}


export function getAuthTokenFromLocalStorage(): string | null {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
}


export function isAuthenticated(): boolean {
    return fetchUserData().then(() => true).catch(() => false) && getAuthTokenFromLocalStorage() !== null;
}


export function logout(): void {
    localStorage.removeItem('authToken');
}


export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = getAuthTokenFromLocalStorage();
    if (!token) {
        throw new Error('Not authenticated');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
    }

    return response;
}


export async function fetchUserData(): Promise<any> {
    const response = await fetchWithAuth(`/auth/sessions/me`);
    return await response.json();
}
