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

          const res = await backend.post('token/refresh/', {
            refresh,
          });
          const { access } = res.data;
          //setAccessTokenInterceptor(access); se necesita implementar access token a todas las solicitudes
          originalRequest.headers.Authorization = 'Bearer ' + access;
          return backend(originalRequest);
        } catch (err) {
          if (
            axios.isAxiosError(err) &&
            (err.response?.status === 401 || error.response.status === 403)
          ) {
            //displayUnauthorizedAlert();
            return handleUnauthorized();
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
