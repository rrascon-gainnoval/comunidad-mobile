import React, { useContext, useState } from 'react';

import moment from 'moment';
import 'moment/locale/es';

import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Container, TextHolder, Text, View, MaterialIcons } from './Themed';

import { theme } from '../constants/Theme';
import { ThemeContext } from '../Theme.Provider';
import { SocialPost } from '../types';

type MoodPropsType = {
  mood: SocialPost;
  handlePress: (id: string) => void;
};

const MOOD_EMOJIS = {
  contento: '😀',
  triste: '😢',
  desanimado: '😔',
  motivado: '😎',
  desmotivado: '😴',
  emocionado: '😁',
  enamorado: '😍',
  risueño: '😂',
  enfermo: '🤒',
};

const MOOD_LIKE_LABELS = {
  contento: 'Me gusta',
  triste: 'Dar ánimos',
  desanimado: 'Dar ánimos',
  motivado: 'Me gusta',
  desmotivado: 'Dar ánimos',
  emocionado: 'Me gusta',
  enamorado: 'Me gusta',
  risueño: 'Me gusta',
  enfermo: 'Dar ánimos',
};

const MOOD_LIKED_LABELS = {
  contento: {
    single: 'A # persona le gusta esto',
    many: 'A # personas les gusta esto',
  },
  triste: {
    single: '# persona envió ánimos',
    many: '# personas enviaron ánimos',
  },
  desanimado: {
    single: '# persona envió ánimos',
    many: '# personas enviaron ánimos',
  },
  motivado: {
    single: 'A # persona le gusta esto',
    many: 'A # personas les gusta esto',
  },
  desmotivado: {
    single: '# persona envió ánimos',
    many: '# personas enviaron ánimos',
  },
  emocionado: {
    single: 'A # persona le gusta esto',
    many: 'A # personas les gusta esto',
  },
  enamorado: {
    single: 'A # persona le gusta esto',
    many: 'A # personas les gusta esto',
  },
  risueño: {
    single: 'A # persona le gusta esto',
    many: 'A # personas les gusta esto',
  },
  enfermo: {
    single: '# persona envió ánimos',
    many: '# personas enviaron ánimos',
  },
};

export const SocialMoodCard = ({ mood, handlePress }: MoodPropsType) => {
  const [isSelected, setIsSelected] = useState(false);
  const { primaryColor } = useContext(ThemeContext);

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: mood.user.icon,
          }}
          style={styles.img}
        />
        <View>
          <Text style={styles.title}>
            {mood.user.first_name} {mood.user.last_name}
          </Text>
          <Text>{moment(mood.date_created).locale('es-mx').format('LL')}</Text>
        </View>
      </View>
      <TextHolder style={styles.message}>
        <Text>
          Hoy me siento {mood.body}{' '}
          {MOOD_EMOJIS[mood.body as keyof typeof MOOD_EMOJIS]}
        </Text>
      </TextHolder>
      <View style={styles.bottom}>
        <Text>
          {MOOD_LIKED_LABELS[mood.body as keyof typeof MOOD_LIKED_LABELS][
            mood.likes === 1 ? 'single' : 'many'
          ].replace('#', mood.likes.toString())}
        </Text>
        <TouchableOpacity
          style={styles.like}
          onPress={() => {
            setIsSelected(!isSelected);
            handlePress(mood.id);
          }}
        >
          <MaterialIcons
            name={mood.is_liked || isSelected ? 'favorite' : 'favorite-border'}
            size={20}
            style={[
              { marginRight: 3 },
              mood.is_liked || isSelected ? { color: primaryColor } : null,
            ]}
          />
          <Text
            style={[
              styles.likeText,
              mood.is_liked || isSelected ? { color: primaryColor } : null,
            ]}
          >
            {MOOD_LIKE_LABELS[mood.body as keyof typeof MOOD_LIKE_LABELS]}
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default SocialMoodCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    padding: theme.paddingSm,
  },
  header: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
  },
  message: {
    marginVertical: theme.marginY,
    padding: theme.paddingSm,
  },
  img: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginRight: theme.marginX,
  },
  bottom: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  like: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 100,
    borderRadius: theme.borderRadius,
    marginLeft: 'auto',
  },
  likeText: { fontWeight: 'bold' },
});
