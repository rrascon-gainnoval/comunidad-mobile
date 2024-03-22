import React, { useContext } from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Container, Text, View, MaterialCommunityIcons } from './Themed';
import { TitleText } from './StyledText';
import { theme } from '../constants/Theme';
import { ThemeContext } from '../Theme.Provider';
import { BirthDay } from '../types';

type BirthdayProps = {
  birthdayList: BirthDay[];
  handleCongrats: (post: BirthDay) => void;
};

export const BirthdayReel = (props: BirthdayProps) => {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <>
      {props.birthdayList.length > 0 && (
        <TitleText>Cumpleaños de hoy</TitleText>
      )}
      <FlatList
        horizontal={true}
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        data={props.birthdayList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Container style={styles.container}>
            <View style={styles.header}>
              <Image
                source={{
                  uri: item.icon,
                }}
                style={styles.img}
              />
              <Text style={styles.title}>
                {item.first_name} {item.last_name}
              </Text>
            </View>
            <View style={styles.bottom}>
              <Text>
                {item.likes}{' '}
                {item.likes === 1 ? 'felicitación' : 'felicitaciones'}
              </Text>
              <TouchableOpacity
                style={styles.like}
                onPress={() => {
                  props.handleCongrats(item);
                }}
              >
                <MaterialCommunityIcons
                  name={item.is_liked ? 'gift' : 'gift-outline'}
                  size={18}
                  style={[
                    styles.icon,
                    item.is_liked && { color: primaryColor },
                  ]}
                />
                <Text
                  style={[
                    {
                      fontWeight: 'bold',
                    },
                    item.is_liked && { color: primaryColor },
                  ]}
                >
                  Felicitar
                </Text>
              </TouchableOpacity>
            </View>
          </Container>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.paddingSm,
    marginVertical: theme.marginY,
    marginHorizontal: theme.marginX,
    width: 250,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  img: {
    height: 35,
    width: 35,
    borderRadius: 50,
    marginRight: theme.marginX,
  },
  bottom: {
    justifyContent: 'space-between',
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
  },
  icon: {
    marginRight: 3,
    marginLeft: 20,
  },
});
