import React, { useState, useEffect, useContext } from 'react';

import { StyleSheet, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PostCard } from '../components/Post.Card';
import { SecondaryButton } from '../components/Secondary.Button';
import { TitleText } from '../components/StyledText';

import moment from 'moment';
import 'moment/locale/es';

import {
  View,
  Text,
  MaterialCommunityIcons,
  Container,
  ScrollView,
} from '../components/Themed';

import { theme } from '../constants/Theme';
import { backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';
import { errorColor } from '../constants/Colors';
import { AlertModal } from '../components/Alert.Modal';
import { ThemeContext } from '../Theme.Provider';
import { Event } from '../types';

type Post = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  squareImage: string;
};

export function EventDetailsScreen({ navigation, route }: any) {
  const appContext = useAppContext();
  const { primaryColor } = useContext(ThemeContext);
  const event: Event = route.params.event;

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  const enrollEvent = async () => {
    setIsLoading(true);
    await backend
      .post(
        'api/inscripciones/',
        {
          event: event.id,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then((res) => {
        setSuccess(true);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setError('El evento ya no tiene cupo');
        }
      })
      .finally(() => setIsLoading(false));
  };

  const fetchDetails = async () => {
    await backend
      .post('utils/api/eventos/evento/', { evento: event.id })
      .then((res) => {
        setPosts(res.data.actualizaciones);
      })
      .catch((err) => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TitleText>{event.title}</TitleText>
      <View
        style={{ marginHorizontal: theme.marginX, marginBottom: theme.marginY }}
      >
        <Text>{event.body}</Text>
        <Text>El {moment(event.start_date).locale('es-mx').format('LL')}</Text>
        {event.end_date > moment().format('YYYY-MM-DD') && (
          <View>
            {event.is_user_signed_up && (
              <Text style={{ color: primaryColor }}>
                {event.type === 'Tournament'
                  ? ' Tienes un equipo inscrito'
                  : ' Inscrito'}
                <MaterialCommunityIcons
                  name="check"
                  size={18}
                  color={primaryColor}
                />
              </Text>
            )}

            {event.type === 'Tournament' && (
              <SecondaryButton
                handlePress={() =>
                  navigation.navigate('EventEnrollTeam', {
                    event,
                    isEditing: event.is_user_signed_up,
                  })
                }
                icon={'clipboard-edit'}
                text={
                  event.is_user_signed_up ? 'Editar equipo' : 'Inscribir equipo'
                }
                isLoading={isLoading}
              />
            )}

            {event.type === 'Event' && !event.is_user_signed_up && (
              <SecondaryButton
                handlePress={enrollEvent}
                icon={success ? 'check' : 'clipboard-edit'}
                text={success ? 'Inscrito' : 'Inscribirse'}
                isLoading={isLoading}
              />
            )}
          </View>
        )}

        {event.end_date < moment().format('YYYY-MM-DD') && (
          <Text style={{ color: primaryColor, marginVertical: theme.marginY }}>
            El evento ya terminó
          </Text>
        )}
      </View>

      {/* Gallery */}
      {event.gallery.length > 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EventGallery', {
              images: event.gallery,
              event,
            })
          }
          style={{
            margin: theme.marginX,
          }}
        >
          <Container>
            <ImageBackground
              style={styles.gallery}
              source={{ uri: event.gallery[0].image }}
              resizeMode="stretch"
            >
              <View style={styles.galleryOverlay}>
                <MaterialCommunityIcons name="eye" size={24} />
                <Text>Ver galeria</Text>
              </View>
            </ImageBackground>
          </Container>
        </TouchableOpacity>
      )}
      {event.type === 'Tournament' && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EventTeams', { event });
          }}
          style={{
            margin: theme.marginX,
          }}
        >
          <Container style={styles.teams}>
            <MaterialCommunityIcons name="account-group" size={24} />
            <Text>Ver equipos</Text>
          </Container>
        </TouchableOpacity>
      )}
      {/* Gallery start*/}
      {posts.length > 0 && <TitleText>Noticias del evento</TitleText>}
      {posts.map((post: Post) => (
        <PostCard
          key={Math.random()}
          title={post.titulo}
          date={post.fecha}
          message={post.descripcion}
          image={post.squareImage && { uri: post.squareImage }}
        />
      ))}
      <AlertModal
        icon="close-circle"
        text={error}
        iconColor={errorColor}
        onPress={() => navigation.goBack()}
        visible={error !== ''}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gallery: {
    height: 220,
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: theme.paddingMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teams: {
    padding: theme.paddingSm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
