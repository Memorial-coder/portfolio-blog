const TOKEN_KEY = 'memorial_admin_token';

export const DEFAULT_ADMIN = {
    username: 'memorial',
    password: ''
};

const hasStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const getToken = () => {
    if (!hasStorage()) return '';
    return localStorage.getItem(TOKEN_KEY) || '';
};

export const setToken = (token) => {
    if (hasStorage()) {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const login = async ({ username, password }) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) return false;

    const data = await response.json();
    setToken(data.token);
    return true;
};

export const logout = () => {
    if (hasStorage()) {
        localStorage.removeItem(TOKEN_KEY);
    }
};

export const isAuthenticated = () => Boolean(getToken());

export const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleAuthFailure = (response) => {
    if (response.status === 401) {
        logout();
    }
};
