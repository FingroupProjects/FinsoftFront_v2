import axios from 'axios';
import { useCookies } from "vue3-cookies";

export async function useAxios(url, options = {}) {
    const { cookies } = useCookies();

    const token = cookies.get('token');

    const defaultOptions = {
        url,
        method: 'GET',
        baseURL: import.meta.env.VITE_API_KEY,
        transformResponse: [function (data) {
            try {
                // console.log(`%c ${this.method?.toUpperCase()} ${url}`, `background: green`, JSON.parse(data || "{}"));
                return JSON.parse(data || "{}");
            } catch (e) {
                return data;
            }
        }],
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            ...(options?.headers ?? {})
        },
    };

    const { data } = await axios(defaultOptions);

    return data;
}