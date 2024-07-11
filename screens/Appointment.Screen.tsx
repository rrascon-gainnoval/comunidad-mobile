import React from 'react';

import moment from 'moment';
import 'moment/locale/es';

import { StyleSheet } from 'react-native';
import { TitleText } from '../components/StyledText';
import { ChipItem } from '../components/Chip.Item';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {
  ScrollView,
  View,
  MaterialCommunityIcons,
  TextHolder,
} from '../components/Themed';

import { theme } from '../constants/Theme';
import { alsApi } from '../constants/Backend';
import { PrimaryButton } from '../components/Primary.Button';
import { Loader } from '../components/Loader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { convertUTCDateToLocalDate } from '../utils/time';
import { UnavailableContent } from '../components/Unavailable.Content';

type Time = {
  text: string;
  valor: string;
};

export const AppointmentScreen = ({ route, navigation }: any) => {
  const { officeName, officeId } = route.params;
  const today = new Date();

  const [date, setDate] = React.useState(new Date());
  const [isopen, setIsopen] = React.useState(false);
  const [availableSchedules, setAvailableSchedules] = React.useState([]);
  const [selectedTime, setSelectedTime] = React.useState<Time>({
    text: '',
    valor: '',
  });
  const [isLoading, setIsLoading] = React.useState(true);

  let mounted = true;

  const fetchAvailability = async () => {
    const localDate = convertUTCDateToLocalDate(date);
    setIsLoading(true);
    const data = {
      id_consultorio: officeId,
      fecha: localDate,
    };
    alsApi
      .post('/citas/disponibilidadConsultorio', data)
      .then((res) => {
        if (mounted) {
          setAvailableSchedules(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {});
  };

  React.useEffect(() => {
    fetchAvailability();
    return () => {
      mounted = false;
    };
  }, [date]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.title}>
        <TitleText>{officeName}</TitleText>
      </View>
      <TitleText>Fecha:</TitleText>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {
          <TitleText style={styles.subtitle}>
            {moment(date).locale('es-mx').format('LL')}
          </TitleText>
        }
        {
          <TouchableOpacity
            onPress={() => {
              setIsopen(true);
            }}
          >
            <TextHolder style={[styles.editButton, styles.editSize]}>
              <MaterialCommunityIcons name="pencil" size={20} />
            </TextHolder>
          </TouchableOpacity>
        }
      </View>
      <TitleText>Horarios disponibles:</TitleText>
      {isLoading ? (
        <Loader size="large" />
      ) : availableSchedules.length <= 0 ? (
        !isLoading && (
          <UnavailableContent
            description="No hay horarios disponibles"
            //onPressRetry={fetchAvailability}
          />
        )
      ) : (
        <View style={styles.schedule}>
          {availableSchedules.map((item: Time) => (
            <ChipItem
              label={item.text}
              key={Math.random()}
              selectedItem={selectedTime}
              onPress={() => {
                setSelectedTime(item);
                // LayoutAnimation.configureNext(
                //   LayoutAnimation.Presets.easeInEaseOut
                // );
              }}
            />
          ))}
        </View>
      )}
      {availableSchedules.length > 0 && selectedTime.valor !== '' && (
        <PrimaryButton
          text="Agendar cita"
          handlePress={() => {
            navigation.navigate('AppointmentConfirm', {
              date: date,
              time: selectedTime,
              office: {
                name: officeName,
                id: officeId,
              },
              type: 'create',
            });
          }}
        />
      )}

      <DateTimePickerModal
        isVisible={isopen}
        mode="date"
        onConfirm={(date) => {
          setDate(date);
          setIsopen(false);
        }}
        onCancel={() => setIsopen(false)}
        maximumDate={moment(today).add(2, 'month').toDate()}
        minimumDate={today}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    margin: theme.marginX,
    alignItems: 'center',
    textAlign: 'center',
  },
  option: {
    margin: theme.marginX,
  },
  iconContainer: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingSm,
    marginTop: theme.marginX,
    marginVertical: theme.marginY,
  },
  datePicker: {
    flexDirection: 'row',
    marginVertical: theme.marginY,
    marginHorizontal: theme.marginX,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 150,
    padding: theme.paddingSm,
    borderRadius: theme.borderRadius,
  },
  schedule: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'space-around',
  },
  subtitle: {
    fontWeight: 'normal',
  },
  iosDatePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.marginX,
  },
  editButton: {
    padding: theme.paddingSm,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.marginX,
  },
  editSize: {
    width: 50,
    height: 50,
  },
});
