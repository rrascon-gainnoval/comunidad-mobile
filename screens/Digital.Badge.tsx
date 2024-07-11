import { ScrollView as DefaultScroll, StyleSheet, Image } from 'react-native';
import React from 'react';

import { useAppContext } from '../App.Provider';
import { TitleText } from '../components/StyledText';
import { Container, View } from '../components/Themed';
import { theme } from '../constants/Theme';
import Barcode from 'react-native-barcode-expo';

export function DigitalBadge() {
  const { user } = useAppContext();

  let userId = user.username;
  if (userId && userId[0] === 'P') {
    userId = userId.substring(1);
  }

  return (
    <DefaultScroll contentContainerStyle={styles.container}>
      <View style={styles.badge}>
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={require('../assets/images/ga.png')}
        />
        <TitleText>
          {user.name} {user.lastname}
        </TitleText>
        <Container style={styles.imgContainer}>
          <Image
            resizeMode="contain"
            style={{
              width: 150,
              height: 150,
            }}
            source={{ uri: user.profileImage }}
          />
        </Container>
        <Barcode height={40} value="Hello World" format="CODE128" />
        <TitleText style={{ fontWeight: 'normal', marginTop: 0 }}>
          {userId}
        </TitleText>
        <Image
          resizeMode="contain"
          style={styles.footer}
          source={require('../assets/images/valores.png')}
        />
      </View>
    </DefaultScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  badge: {
    marginHorizontal: theme.marginX * 2,
    marginVertical: theme.marginY * 2,
    alignItems: 'center',
    padding: theme.paddingMd,
    borderRadius: theme.borderRadius * 2,
    height: 550,
    width: 420,
  },
  logo: {
    width: 135,
    height: 80,
    marginBottom: theme.marginY * 2,
  },
  footer: {
    width: 200,
    height: 80,
    bottom: 0,
    position: 'absolute',
  },
  imgContainer: {
    width: 220,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.marginY * 2,
  },
});
