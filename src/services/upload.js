import { authHeaders, handleAuthFailure } from './auth';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: authHeaders(),
        body: formData
    });

    if (!response.ok) {
        handleAuthFailure(response);
        const message = await response.text();
        throw new Error(message || 'Image upload failed');
    }

    return response.json();
};
