import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { TextInput } from '../components/Text.Input';
import { TitleText } from '../components/StyledText';
import { PrimaryButton } from '../components/Primary.Button';
import { PinInput } from '../components/Pin.Input';

import { errorColor, primaryColor } from '../constants/Colors';
import { theme } from '../constants/Theme';
import { altatecaWeb, backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';
import { AlertModal } from '../components/Alert.Modal';
import { AlertMessage } from '../components/Alert.Message';

export function WalletCreatePin({ navigation, route }: any) {
  const appContext = useAppContext();

  const [error, setError] = useState<string>('');
  const [pin, setPin] = useState<{
    pin1: string;
    pin2: string;
    pin3: string;
    pin4: string;
  }>({
    pin1: '',
    pin2: '',
    pin3: '',
    pin4: '',
  });

  const [password, setPassword] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [modal, setModal] = useState({
    title: '',
    text: '',
    icon: '',
    iconColor: '',
  });

  const handlePinChange = (text: string, inputRef: any, index: number) => {
    setPin({ ...pin, [`pin${index + 1}`]: text });
    if (inputRef.current && text) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = async () => {
    if (
      pin.pin1 === '' ||
      pin.pin2 === '' ||
      pin.pin3 === '' ||
      pin.pin4 === ''
    ) {
      setError('Ingresa los 4 digitos del NIP');
      return;
    }
    if (!password) {
      setError('Ingresa tu contraseña');
      return;
    }
    setIsButtonLoading(true);
    try {
      await backend.post('api/token/', {
        password: password,
        id_empleado: appContext.user.id,
      });

      try {
        await altatecaWeb.get(
          `clickbalance_api/GestionCredito?codigo_empleado=${
            appContext.user.id
          }&id_campo=${appContext.user.locationId}&nip=${
            pin.pin1 + pin.pin2 + pin.pin3 + pin.pin4
          }&movimiento=ACTIVAR_CREDITO`
        );
        setModal({
          title: 'Felicidades!',
          text: 'Tu crédito ha sido activado con éxito',
          icon: 'check-circle',
          iconColor: primaryColor,
        });
        setShowAlert(true);
      } catch (error) {
        setModal({
          title: 'Error',
          text: 'Hubo un error al activar el credito',
          icon: 'close-circle',
          iconColor: errorColor,
        });
        setShowAlert(true);
      }
    } catch (error) {
      setError('Contraseña incorrecta');
    }
    setIsButtonLoading(false);
  };

  return (
    <View style={styles.container}>
      <View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TitleText>Ingresa tu nuevo NIP</TitleText>

        <View style={{ padding: theme.paddingSm }}>
          <AlertMessage>
            <Text>
              La activación de tu crédito podría verse reflejada haste dentro de
              1 hora.
            </Text>
          </AlertMessage>
        </View>

        <PinInput
          handleChange={(text: string, inputRef: any, index: number) => {
            handlePinChange(text, inputRef, index);
          }}
        />
        <TitleText>Ingresa tu contraseña para confirmar</TitleText>

        <TextInput
          placeholder="Contraseña"
          icon="vpn-key"
          secureTextEntry={true}
          value={password}
          onChangeText={(text: string) => setPassword(text)}
        />
        <PrimaryButton
          text="Continuar"
          handlePress={handleSubmit}
          style={{ marginTop: 80 }}
          isLoading={isButtonLoading}
        />
      </View>
      <AlertModal
        onPress={() => {
          setShowAlert(false);
          navigation.navigate('WalletHome');
        }}
        visible={showAlert}
        text={modal.text}
        icon={modal.icon}
        iconColor={modal.iconColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.paddingMd,
    color: errorColor,
    marginVertical: theme.marginY,
    fontSize: theme.fontSizeLg,
  },
  img: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: theme.marginY,
  },
  description: {
    textAlign: 'center',
    fontWeight: 'normal',
    marginBottom: 50,
  },
});
