import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { TitleText } from '../components/StyledText';

import {
  Container,
  TextHolder,
  MaterialCommunityIcons,
  View,
} from '../components/Themed';

import { Loader } from '../components/Loader';
import { UnavailableContent } from '../components/Unavailable.Content';

import { alsApi } from '../constants/Backend';
import { theme } from '../constants/Theme';
import { useAppContext } from '../App.Provider';

const campos = [
  { id: 1, name: 'DON ENRIQUE' },
  { id: 2, name: 'LA CUESTA' },
  { id: 3, name: 'DON MARIO' },
  { id: 4, name: 'SANTA LUCIA' },
  { id: 5, name: 'EL COMPA' },
  { id: 6, name: 'CAMPO GRANDE' },
  { id: 7, name: 'LA CASITA' },
  { id: 8, name: 'POZO MANUEL' },
  { id: 9, name: 'ALTA ELVA' },
  { id: 10, name: 'LA CUESTITA' },
  { id: 11, name: 'SANTA LETICIA' },
];

type AppointmentCreateProps = {
  handlePress: (params: any) => void;
};

export const AppointmentCreateScreen = (props: AppointmentCreateProps) => {
  const [menu, setMenu] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const appContext = useAppContext();
  let mounted = true;

  const fetchAvailability = async () => {
    const camposNames = campos.map((campo) => campo.name);
    const locationIndex = camposNames.indexOf(appContext.user.locationName);

    const data = {
      id_campo: campos[locationIndex].id,
      fecha: new Date(),
    };
    alsApi
      .post('/citas/consultar_disponibilidad', data)
      .then((res) => {
        if (mounted) {
          setIsLoading(false);
          setMenu(res.data);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchAvailability();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <TitleText style={styles.subtitle}>Clínicas disponibles:</TitleText>
      {isLoading && <Loader size="large" />}
      {menu.length <= 0
        ? !isLoading && (
            <UnavailableContent
              description="No hay clínicas disponibles en este momento"
              onPressRetry={fetchAvailability}
            />
          )
        : menu.map((item: any) => (
            <TouchableOpacity
              key={item.id_consultorio}
              onPress={() => {
                props.handlePress({
                  officeId: item.id_consultorio,
                  officeName: item.consultorio.split(' - ')[1],
                  availableSchedules: item.horarios,
                });
              }}
            >
              <Container style={styles.option}>
                <TextHolder style={styles.description}>
                  <MaterialCommunityIcons
                    name={
                      item.consultorio.includes('DENTAL')
                        ? 'tooth-outline'
                        : 'stethoscope'
                    }
                    size={30}
                  />
                  <TitleText
                    style={{
                      fontWeight: 'normal',
                    }}
                  >
                    {item.consultorio.split(' - ')[1]}
                  </TitleText>
                </TextHolder>
              </Container>
            </TouchableOpacity>
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  option: {
    paddingHorizontal: 50,
    paddingVertical: theme.paddingMd,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
  iconContainer: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingSm,
    marginTop: theme.marginX,
    marginVertical: theme.marginY,
  },
  subtitle: {
    textAlign: 'justify',
    marginVertical: 20,
  },
  description: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius,
    justifyContent: 'space-around',
  },
});
