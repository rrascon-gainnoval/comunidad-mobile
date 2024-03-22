import axios from 'axios';
import {
  COMALTA_API_URL,
  COMALTA_API_TESTING_URL,
  GLOBALMET_GA_API_URL,
  GLOBALMET_RED_API_URL,
  GLOBALMET_FORECAST_API_URL,
  GLOBALMET_API_TOKEN,
  ALS_API_URL,
  ALTATECA_API_URL,
  ALTATECA_WEB_URL,
} from '@env';

console.log(COMALTA_API_URL);

export const prodURL = COMALTA_API_URL;
export const testingURL = COMALTA_API_TESTING_URL;
export const gaWeatherURL = GLOBALMET_GA_API_URL;
export const redWeatherURL = GLOBALMET_RED_API_URL;
const forecastURL = GLOBALMET_FORECAST_API_URL;
export const gmToken = GLOBALMET_API_TOKEN;

export const backend = axios.create({
  baseURL: prodURL,
});

export const weatherApi = axios.create();

export const forecastApi = axios.create({
  baseURL: forecastURL,
  headers: {
    Authorization: gmToken,
  },
});

export const alsApi = axios.create({
  baseURL: ALS_API_URL,
});

export const altatecaApi = axios.create({
  baseURL: `${ALTATECA_API_URL}/api/`,
});

export const altatecaWeb = axios.create({
  baseURL: ALTATECA_WEB_URL,
});

export const socketsApi = axios.create({
  baseURL: 'http:localhost:3000/api/',
});
