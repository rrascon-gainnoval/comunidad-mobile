import { ActivityIndicator, Image, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { theme } from '../constants/Theme';
import { HeaderText } from '../components/StyledText';
import { PrimaryButton } from '../components/Primary.Button';
import { useEffect, useState } from 'react';
import { Barcode } from 'expo-barcode-generator';
import { useAppContext } from '../App.Provider';
import { backend } from '../constants/Backend';
import { Loader } from '../components/Loader';
import { AlertMessage } from '../components/Alert.Message';

export const OrganoMixtoScreen = () => {
  const { user } = useAppContext();
  const [fetching, setFetching] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  //TO DO:
  //Buscar la ultima solicitud valida del usuario ✅

  //si no existe, crear una nueva solicitud
  const createRequest = async () => {
    setCreating(true);
    try {
      const res = await backend.post(
        `api/termos/`,
        {
          codigo_empleado: user.username,
          nombres_empleado: user.name,
          apellido_paterno_empleado: user.apellido_paterno_empleado,
          apellido_materno_empleado: user.apellido_materno_empleado ?? '',
          fecha_nacimiento_empleado: user.fecha_nacimiento_empleado,
          campo: user.locationName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );
      setPromoCode(res.data.codigo_promo);
    } catch (error) {
    } finally {
      setCreating(false);
    }
  };

  const validateRequest = async () => {
    try {
      const res = await backend.get(
        `api/validar_termos/?codigo_empleado=${user.username}`,
        {
          headers: {
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );
      if (res.data && res.data.codigo_promo) {
        setPromoCode(res.data.codigo_promo);
      }
    } catch (error) {
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    validateRequest();
  }, []);

  if (fetching) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }

  if (promoCode)
    return (
      <View style={styles.container}>
        <HeaderText>¡Ya puedes aplicar tu descuento!</HeaderText>
        <Text>
          Puedes ir a la tienda y mostrar el código para aplicar tu descuento.
        </Text>
        <AlertMessage>
          <Text>Este código puede ser canjeado sólo una vez</Text>
        </AlertMessage>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Barcode
            value={promoCode}
            options={{
              format: 'CODE128',
              background: 'white',
              height: 60,
              displayValue: true,
            }}
          />
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <HeaderText>¡Solicita un descuento para termo de agua!</HeaderText>
      <Text>
        Puedes solicitar un nuevo descuento para el termo de agua cada año.
      </Text>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          resizeMode="contain"
          source={require('../assets/images/chest.png')}
          style={styles.image}
        />
      </View>
      <PrimaryButton
        isLoading={creating}
        style={{ marginTop: 'auto' }}
        text="SOLICITAR"
        handlePress={createRequest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.paddingSm,
    paddingBottom: theme.paddingLg * 2,
    gap: theme.paddingSm,
  },
  image: {
    height: 190,
    width: 300,
  },
});
