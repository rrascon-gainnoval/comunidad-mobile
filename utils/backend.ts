import axios from 'axios';
import { backend } from '../constants/Backend';
import { getSecureValueFor } from './storage';

export const setAccessTokenInterceptor = (token: string) => {
  backend.interceptors.request.use((config) => {
    if (!config.headers) {
      return config;
    }

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};

export const setRefreshTokenInterceptor = (handleUnauthorized: () => void) => {
  backend.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isAuthRequest = originalRequest.url.includes('token/');

      if (error.response.status === 401 && !isAuthRequest) {
        try {
          const refresh = await getSecureValueFor('refreshToken');

          const res = await backend.post('api/token/refresh/', {
            refresh,
          });
          const { access } = res.data;
          setAccessTokenInterceptor(access);
          originalRequest.headers.Authorization = 'Bearer ' + access;
          return backend(originalRequest);
        } catch (err) {
          if (
            axios.isAxiosError(err) &&
            (err.response?.status === 401 || error.response.status === 403)
          ) {
            return handleUnauthorized();
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
