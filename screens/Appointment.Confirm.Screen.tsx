import React, { useContext } from 'react';

import moment from 'moment';
import 'moment/locale/es';

import { StyleSheet, Image, Platform } from 'react-native';

import { TitleText } from '../components/StyledText';

import {
  ScrollView,
  View,
  Text,
  MaterialCommunityIcons,
} from '../components/Themed';

import { alsApi } from '../constants/Backend';

import { PrimaryButton } from '../components/Primary.Button';

import { useAppContext } from '../App.Provider';
import { errorColor } from '../constants/Colors';
import { ThemeContext } from '../Theme.Provider';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const AppointmentConfirmScreen = ({ navigation, route }: any) => {
  const { office, date, time, type, id } = route.params;
  const appContext = useAppContext();
  const { primaryColor } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [message, setMessage] = React.useState(
    type === 'create'
      ? 'Confirma los detalles de tu cita'
      : '¿Seguro que quieres cancelar la cita?'
  );

  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  async function schedulePushNotification() {
    const dateString = date.toISOString().split('T')[0];
    const timeString = time.text.split(' ')[0];

    const hours =
      moment
        .duration(moment(dateString + ' ' + timeString).diff(moment()))
        .asHours() - 1;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Tienes una cita 📅',
        body: `Recuerda que tienes una cita en ${office.name} a las ${time.text}`,
        data: { data: 'goes here' },
      },
      trigger: {
        seconds: hours * 60 * 60,
      },
    });
  }

  const handleConfirm = async () => {
    setIsLoading(true);
    if (type === 'create') {
      alsApi
        .post('/citas/registrar/', {
          id_consultorio: office.id,
          fecha: date,
          hora: time.valor,
          nomina: appContext.user.id,
          nombre: `${appContext.user.name} ${appContext.user.lastname}`,
        })
        .then((res) => {
          setMessage(res.data.msg);
          if (res.data.response) {
            setSuccess(true);
            schedulePushNotification();
          } else {
            setError(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => {
            navigation.navigate('AppointmentMenu');
          }, 2000);
        });
    } else {
      alsApi
        .post('/citas/cancelar/', {
          id_cita: id,
        })
        .then((res) => {
          setMessage('Cita cancelada con éxito');
          if (res.data) {
            setSuccess(true);
            Notifications.cancelAllScheduledNotificationsAsync();
          } else {
            setError(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
          setTimeout(() => {
            navigation.navigate('AppointmentMenu');
          }, 2000);
        });
    }
  };

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/tsocial.png')}
          style={styles.img}
        />
      </View>
      <Text style={styles.title}>{message}</Text>
      <View style={styles.detailsContainer}>
        <TitleText style={styles.details}>
          {type === 'create' ? office.name : office}
        </TitleText>
        <TitleText style={styles.details}>
          {moment(date).locale('es-mx').format('LL')},{' '}
          {type === 'create' ? time.text : time}
        </TitleText>
      </View>
      {success ? (
        <View style={styles.success}>
          <MaterialCommunityIcons
            name="check-circle"
            size={100}
            color={primaryColor}
          />
        </View>
      ) : error ? (
        <View style={styles.success}>
          <MaterialCommunityIcons
            name="close-circle"
            size={100}
            color={errorColor}
          />
        </View>
      ) : (
        <PrimaryButton
          isLoading={isLoading}
          handlePress={handleConfirm}
          text={type === 'delete' ? 'Cancelar cita' : 'Confirmar'}
          style={type === 'delete' && styles.error}
        />
      )}
    </ScrollView>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 20,
  },
  details: {
    textAlign: 'center',
    marginBottom: 0,
  },
  detailsContainer: {
    marginVertical: 30,
  },
  img: {
    height: 250,
    resizeMode: 'contain',
    marginTop: 20,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: { alignItems: 'center', marginVertical: 30 },
  error: { backgroundColor: errorColor },
});
