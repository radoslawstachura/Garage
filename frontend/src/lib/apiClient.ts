import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { auth } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
    const token = auth.getAccessToken();

    const headers = {
        ...(config.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
        const response: AxiosResponse<T> = await axios({
            ...config,
            baseURL: BASE_URL,
            headers,
            withCredentials: true,
        });

        await sleep(1000);

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                const newToken = await auth.refreshAccessToken();

                if (newToken) {
                    const retryResponse: AxiosResponse<T> = await axios({
                        ...config,
                        baseURL: BASE_URL,
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${newToken}`,
                        },
                        withCredentials: true,
                    });
                    await sleep(1000);

                    return retryResponse.data;
                }
            }
            throw error;
        } else {
            throw new Error("Unexpected error in request");
        }
    }
}

export const apiClient = {
    get: <T>(url: string, config: AxiosRequestConfig = {}) =>
        request<T>({ ...config, method: 'GET', url }),

    post: <T>(url: string, data?: unknown, config: AxiosRequestConfig = {}) =>
        request<T>({ ...config, method: 'POST', url, data }),

    put: <T>(url: string, data?: unknown, config: AxiosRequestConfig = {}) =>
        request<T>({ ...config, method: 'PUT', url, data }),

    delete: <T>(url: string, config: AxiosRequestConfig = {}) =>
        request<T>({ ...config, method: 'DELETE', url }),
};
