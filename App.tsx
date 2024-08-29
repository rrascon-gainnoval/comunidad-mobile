import 'react-native-gesture-handler';
import React, { useMemo, useReducer } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginNavigation } from './navigation/login';
import {
  setUserSession,
  removeUserSession,
  getUserSession,
  AuthContext,
  setMenuSurvey,
  getMenuSurvey,
  setPushToken,
  getPushToken,
} from './App.Provider';
import Navigation from './navigation';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import useCachedResources from './hooks/useCachedResources';

import { backend } from './constants/Backend';

import { Platform, UIManager } from 'react-native';
import { Loader } from './components/Loader';

import { ChangePasswordScreen } from './screens/Change.Password.Screen';
import { ThemeProvider } from './Theme.Provider';
import { storeIsPrivacyTermsSigned } from './utils/storage';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const isLoadingComplete = useCachedResources();

  const initialLoginState = {
    isLoading: true,
    user: null,
  };

  const loginReducer = (prevState: any, action: any) => {
    switch (action.type) {
      case 'RETRIEVE':
        return {
          ...prevState,
          user: action.user,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          isLoading: false,
          user: action.user,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          isLoading: false,
          user: null,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext: any = useMemo(
    () => ({
      signIn: async (username: string, password: string) => {
        let user: any = null;
        await backend
          .post('api/token/', { username, password })
          .then(async (response) => {
            const userData = response.data;

            user = {
              id: userData.id,
              username: userData.username,
              name: userData.name,
              lastname: `${userData.last_name} ${
                userData.second_lastname ?? ''
              }`,
              points: userData.coins,
              xp: userData.xp,
              token: {
                access: userData.access,
                refresh: userData.refresh,
              },
              passChanged: userData.pass_changed,
              location: userData.location,
              location_id: userData.location_id,
              locationName: userData.location_name,
              apellido_paterno_empleado: userData.last_name,
              apellido_materno_empleado: userData.second_lastname,
              fecha_nacimiento_empleado: userData.fecha_nacimiento_empleado,
            };
            setUserSession(user);
            storeIsPrivacyTermsSigned(true);

            try {
              registerForPushNotificationsAsync().then((pushToken) => {
                if (!pushToken) {
                  return;
                }
                setPushToken(pushToken);

                backend.post(
                  'dispositivos/',
                  {
                    push_token: pushToken,
                    platform: Platform.OS,
                    name: Device.deviceName,
                    user: user.id,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${user.access}`,
                    },
                  }
                );
              });
            } catch {}
            /** */
            dispatch({
              type: 'LOGIN',
              user: user,
            });
          })
          .catch((error) => {
            if (error.response.status === 401) {
              throw new Error('Usuario o contraseña incorrectos');
            }
          });
      },

      signOut: async () => {
        const session = await getUserSession();
        const token = await getPushToken();
        if (token) {
          try {
            await backend.post(
              'notificaciones/delete_device/',
              {
                user: session.id,
                token: token,
              },
              {
                headers: {
                  Authorization: `Bearer ${session.token.access}`,
                },
              }
            );
          } catch (error) {}
        }
        removeUserSession();
        dispatch({ type: 'LOGOUT' });
      },

      user: loginState.user,
    }),
    [loginState.user]
  );

  const retreiveUserSession = async () => {
    let user = null;
    user = await getUserSession();
    dispatch({
      type: 'RETRIEVE',
      user: user,
    });
  };

  const checkForSurvey = async () => {
    const time = new Date().getHours();
    if (time < 13) {
      setMenuSurvey('');
    } else {
      const isSurveyDone = await getMenuSurvey();
      if (isSurveyDone === '') {
        if (time >= 13) {
          setMenuSurvey('true');
        }
      }
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
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
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  React.useEffect(() => {
    checkForSurvey();
    retreiveUserSession();
  }, []);

  if (!isLoadingComplete || loginState.isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthContext.Provider value={authContext}>
          {loginState.user ? (
            loginState.user.passChanged === false ? (
              <ChangePasswordScreen />
            ) : (
              <Navigation />
            )
          ) : (
            <LoginNavigation />
          )}
        </AuthContext.Provider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
