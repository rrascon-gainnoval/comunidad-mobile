import React, { useEffect, useState } from 'react';

import moment from 'moment';
import 'moment/locale/es';

import {
  Image,
  StyleSheet,
  View as DefaultView,
  TouchableOpacity,
} from 'react-native';

import { HeaderText, TitleText } from '../components/StyledText';
import {
  Container,
  MaterialCommunityIcons,
  ScrollView,
  Text,
  View,
} from '../components/Themed';
import { theme } from '../constants/Theme';
import { backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';
import { useIsFocused } from '@react-navigation/native';
import { Loader } from '../components/Loader';
import { UnavailableContent } from '../components/Unavailable.Content';
import { BlockedContent } from '../components/Blocked.Content';
import { useBlockContent } from '../hooks/useBlockContent';
import { Event } from '../types';

export function EventsHomeScreen({ navigation }: any) {
  const appContext = useAppContext();
  const isFocused = useIsFocused();
  const isBlocked = useBlockContent();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    await backend
      .get('api/eventos/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [isFocused]);

  if (isBlocked) {
    return (
      <View style={{ flex: 1 }}>
        <BlockedContent />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HeaderText>¡No te pierdas ningún evento!</HeaderText>
      <TitleText>Todos los eventos</TitleText>
      {isLoading && <Loader />}
      {events.length < 1 && !isLoading && (
        <UnavailableContent description="No hay eventos en este momento" />
      )}
      {events.map((event: Event) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('EventDetails', { event: event })}
          key={Math.random()}
        >
          <Container style={styles.event}>
            {event.image && (
              <Image
                style={styles.img}
                resizeMode="stretch"
                source={{
                  uri: event.image,
                }}
              />
            )}
            <DefaultView
              style={{ marginLeft: theme.marginX + 5, width: 0, flexGrow: 1 }}
            >
              <Text style={styles.title}>{event.title}</Text>
              <Text style={{ marginBottom: theme.marginY / 2 }}>
                <MaterialCommunityIcons name="map-marker" size={16} />
                {'  ' + event.place}
              </Text>
              <Text style={{ marginBottom: theme.marginY / 2 }}>
                <MaterialCommunityIcons name="calendar-star" size={16} />
                {event.start_date !== event.end_date
                  ? ` Del ${moment(event.start_date)
                      .locale('es-mx')
                      .format('LL')} al ${moment(event.end_date)
                      .locale('es-mx')
                      .format('LL')}`
                  : ` ${moment(event.start_date).locale('es-mx').format('LL')}`}
              </Text>
              <Text style={{ marginBottom: theme.marginY }}>
                <MaterialCommunityIcons
                  name={
                    event.type === 'Tournament' ? 'account-group' : 'account'
                  }
                  size={16}
                />
                {event.type === 'Tournament'
                  ? // ` ${event.equipos} ${
                    //     event.equipos === 1 ? "equipo" : "equipos"
                    //   }`
                    ''
                  : ` ${event.attendees} ${
                      event.attendees === 1 ? 'asistente' : 'asistentes'
                    }`}
              </Text>
            </DefaultView>
          </Container>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  event: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    paddingVertical: theme.paddingMd,
    paddingHorizontal: theme.paddingSm,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 90,
    width: 90,
    borderRadius: 20,
  },
  title: {
    fontWeight: 'bold',
  },
});
