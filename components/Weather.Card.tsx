import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

import { Text, View, TextHolder, Container, MaterialIcons } from './Themed';
import { theme } from '../constants/Theme';

import {
  weatherApi,
  forecastApi,
  gaWeatherURL,
  redWeatherURL,
  gmToken,
} from '../constants/Backend';
import { useAppContext } from '../App.Provider';

import { convertUTCDateToLocalDate } from '../utils/time';
import { UnavailableContent } from './Unavailable.Content';

import moment from 'moment';
import 'moment/locale/es';

type WeatherType = {
  temperatura_c: number;
  fecha_medicion: string;
  radiacion_solar: number;
} | null;

type ForecastType = {
  nubosidad_total_porc: number;
  precipitacion_acum_mm: number;
} | null;

const dayIcons = [
  require('../assets/images/clearDay.png'),
  require('../assets/images/semiCloudyDay.png'),
  require('../assets/images/semiRainyDay.png'),
  require('../assets/images/cloudy.png'),
  require('../assets/images/rainy.png'),
];
const nightIcons = [
  require('../assets/images/clearNight.png'),
  require('../assets/images/semiCloudyNight.png'),
  require('../assets/images/semiRainyNight.png'),
  require('../assets/images/cloudy.png'),
  require('../assets/images/rainy.png'),
];

const locationIds = [
  { id: '7', name: 'Don Enrique', weatherApi: gaWeatherURL, token: gmToken },
  { id: '8', name: 'Pozo Manuel', weatherApi: gaWeatherURL, token: gmToken },
  { id: '127', name: 'Santa Lucia', weatherApi: gaWeatherURL, token: gmToken },
  { id: '429', name: 'Don Mario', weatherApi: gaWeatherURL, token: gmToken },
  { id: '431', name: 'La Cuestita', weatherApi: gaWeatherURL, token: gmToken },
  {
    id: '470',
    name: 'Santa Leticia',
    weatherApi: gaWeatherURL,
    token: gmToken,
  },
  {
    id: '540',
    name: 'Don Enrique 2',
    weatherApi: gaWeatherURL,
    token: gmToken,
  },
  { id: '678', name: 'Alta Elva', weatherApi: gaWeatherURL, token: gmToken },
  { id: '807', name: 'La Casita', weatherApi: gaWeatherURL, token: gmToken },
  { id: '808', name: 'El Compa', weatherApi: gaWeatherURL, token: gmToken },
  {
    id: '190/last',
    name: 'La Cuesta',
    weatherApi: redWeatherURL,
    token: '',
  },
];

export const WeatherCard = () => {
  const appContext = useAppContext();
  let mounted = true;

  const [weather, setWeather] = useState<WeatherType>(null);
  const [forecast, setForecast] = useState<ForecastType>(null);
  const [icons, setIcons] = useState<string>('dayIcons');
  const [date, setDate] = useState<string>('0000-00-00T00:00:00Z');

  const location = locationIds.find(
    (item: any) => item.name.toUpperCase() === appContext.user.locationName
  );

  const fetchWeather = async () => {
    await weatherApi
      .get(`${location?.weatherApi}${location?.id}/`, {
        headers: {
          Authorization: location?.token ? location.token : '',
        },
      })
      .then((response) => {
        setWeather({ ...response.data });
        setDate(
          convertUTCDateToLocalDate(
            new Date(response.data.fecha_medicion)
          ).toISOString()
        );
      })
      .catch((error) => {});
  };

  const fetchForecast = async () => {
    const today = new Date();
    if (today.getHours() >= 19) {
      setIcons('nightIcons');
    }
    await forecastApi
      .get(`${location?.id}/?fecha=${today.toISOString().split('T')[0]}`)
      .then((response) => {
        if (mounted) {
          const data = response.data;
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setForecast(data[data.length - 1]);
        }
      })
      .catch((error) => {});
  };

  const handlePress = () => {
    fetchWeather();
    fetchForecast();
  };

  useEffect(() => {
    fetchWeather();
    fetchForecast();

    return () => {
      mounted = false;
    };
  }, []);

  const getForecastIcon = (cloudiness: number, precipitation: number) => {
    let iconSet = dayIcons;
    if (icons === 'nightIcons') {
      iconSet = nightIcons;
    }

    if (cloudiness >= 50 && cloudiness < 100) {
      if (precipitation > 0) {
        return iconSet[2];
      }
      return iconSet[1];
    } else if (cloudiness === 100) {
      if (precipitation > 0) {
        return iconSet[4];
      }
      return iconSet[3];
    } else {
      return iconSet[0];
    }
  };

  if (!weather || !weather?.temperatura_c) {
    return (
      <Container
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <UnavailableContent
          description="El clima no está disponible"
          small={true}
        />
      </Container>
    );
  }
  return (
    <Container style={styles.container}>
      <View style={styles.weatherContainer}>
        {forecast?.nubosidad_total_porc != null && (
          <Image
            style={styles.image}
            source={getForecastIcon(
              forecast.nubosidad_total_porc,
              forecast.precipitacion_acum_mm
            )}
          />
        )}
        <Text style={styles.weatherText}>{`${Math.round(
          weather.temperatura_c
        )} °C`}</Text>
      </View>
      <TextHolder style={styles.descriptionContainer}>
        <Text>{appContext.user.locationName}</Text>
        <TextHolder style={styles.descriptionText}>
          <Text>
            {moment(date.split('T')[0]).format('L') +
              ' ' +
              date.split('T')[1].split(':')[0] +
              ':' +
              date.split('T')[1].split(':')[1]}
          </Text>
          <TouchableOpacity style={styles.retry} onPress={handlePress}>
            <MaterialIcons name="replay" size={20} />
          </TouchableOpacity>
        </TextHolder>
      </TextHolder>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
  image: {
    width: 45,
    height: 45,
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  weatherText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: theme.paddingSm,
  },
  descriptionContainer: {
    padding: theme.paddingSm,
    borderRadius: theme.borderRadius,
  },
  descriptionText: { flexDirection: 'row', alignItems: 'center' },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.marginX,
  },
});
