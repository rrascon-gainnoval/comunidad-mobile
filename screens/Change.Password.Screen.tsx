import React, { useState, useContext, useMemo } from 'react';
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';

import { View, Text, MaterialCommunityIcons } from '../components/Themed';
import { TitleText } from '../components/StyledText';
import { PrimaryButton } from '../components/Primary.Button';
import { TextInput } from '../components/Text.Input';

import { theme } from '../constants/Theme';
import { errorColor } from '../constants/Colors';

import * as Layout from '../constants/Layout';

import { useKeyboard } from '../hooks/useKeyboard';
import { backend } from '../constants/Backend';
import { AuthContext, useAppContext } from '../App.Provider';
import { ThemeContext } from '../Theme.Provider';

const layout = Layout.default;
const isSmallDevice = layout.isSmallDevice;

const bgList = [
  require('../assets/images/female_bg.png'),
  require('../assets/images/male_bg.png'),
];

const defaultPass = 'grupoalta22';

export const ChangePasswordScreen = ({ navigation, route }: any) => {
  const isKeyBoardOpen = useKeyboard();
  const appContext = useAppContext();
  const { signIn } = useContext<any>(AuthContext);
  const { primaryColor } = useContext(ThemeContext);

  const randomBg = useMemo(() => Math.floor(Math.random() * bgList.length), []);

  const [password, setPassword] = useState({
    new: '',
    confirm: '',
    previous: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!password.new) {
      setError('Ingresa tu nueva contraseña');
      setIsLoading(false);
      return;
    }

    if (password.new === defaultPass) {
      setError('La contraseña no puede ser igual a la inicial');
      setIsLoading(false);
      return;
    }

    if (password.new.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    if (password.new !== password.confirm) {
      setIsLoading(false);
      return setError('Las contraseñas no coinciden');
    }

    if (route?.params?.source === 'profile') {
      if (!password.previous) {
        setError('Ingresa tu contraseña actual');
        setIsLoading(false);
        return;
      }
      try {
        await signIn(appContext.user.username, password.previous);
      } catch (error) {
        setError('Tu contraseña actual no coincide');
        setIsLoading(false);
        return;
      }
    }

    await backend
      .put(
        `api/usuarios/contraseña/${appContext.user.id}/`,
        {
          password: password.new,
          confirm_password: password.confirm,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          if (route?.params?.source === 'profile') {
            return navigation.goBack();
          }
          signIn(appContext.user.username, password.new);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={bgList[randomBg]}
        />
        <View
          style={[
            styles.form,
            isKeyBoardOpen && Platform.OS === 'ios' && { paddingBottom: 250 },
          ]}
        >
          {success && (
            <MaterialCommunityIcons
              style={{ alignSelf: 'center', marginBottom: 20 }}
              name="check-circle"
              size={50}
              color={primaryColor}
            />
          )}
          <TitleText style={{ alignSelf: 'center', textAlign: 'center' }}>
            {success
              ? '¡Contraseña creada con éxito!'
              : 'Crea una nueva contraseña'}
          </TitleText>

          {!success && (
            <View
              style={{
                marginBottom:
                  isKeyBoardOpen && Platform.OS === 'android' ? 0 : 30,
              }}
            >
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TextInput
                secureTextEntry={true}
                placeholder="Nueva contraseña"
                icon="vpn-key"
                value={password.new}
                onChangeText={(text: string) =>
                  setPassword({
                    ...password,
                    new: text,
                  })
                }
              />
              <TextInput
                secureTextEntry={true}
                placeholder="Confirmar nueva contraseña"
                icon="vpn-key"
                value={password.confirm}
                onChangeText={(text: string) =>
                  setPassword({
                    ...password,
                    confirm: text,
                  })
                }
              />
              {route?.params?.source === 'profile' && (
                <TextInput
                  secureTextEntry={true}
                  placeholder="Contraseña actual"
                  icon="vpn-key"
                  value={password.previous}
                  onChangeText={(text: string) =>
                    setPassword({
                      ...password,
                      previous: text,
                    })
                  }
                />
              )}
              <PrimaryButton
                text="CAMBIAR CONTRASEÑA"
                handlePress={handleSubmit}
                isLoading={isLoading}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    height: isSmallDevice ? 250 : 390,
    width: '100%',
  },
  message: {
    fontWeight: '400',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    marginBottom: theme.paddingMd,
    minHeight: isSmallDevice ? 300 : 500,
    width: '100%',
  },
  error: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.paddingMd,
    color: errorColor,
  },
});
