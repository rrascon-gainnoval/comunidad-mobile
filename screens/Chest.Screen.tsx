import React, { useEffect, useRef } from 'react';

import { StyleSheet, Image, Animated } from 'react-native';

import { ScrollView, Text, TextHolder, View } from '../components/Themed';

import { UvaCoins } from '../components/Uva.Coins';
import { TitleText } from '../components/StyledText';
import { SecondaryButton } from '../components/Secondary.Button';
import { PrimaryButton } from '../components/Primary.Button';

import { theme } from '../constants/Theme';

import { backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';
import { Loader } from '../components/Loader';
import { useIsFocused } from '@react-navigation/native';
import { useCountdown } from '../hooks/useCountdown';
import moment, { Moment } from 'moment';
import { primaryColor } from '../constants/Colors';
import { XpPoints } from '../components/Xp.Points';
import { BlockedContent } from '../components/Blocked.Content';
import { useBlockContent } from '../hooks/useBlockContent';

const awards = [
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 0,
    value: 5,
    type: 'xp',
  },
  {
    id: 1,
    value: 15,
    type: 'xp',
  },
  {
    id: 1,
    value: 15,
    type: 'xp',
  },
  {
    id: 1,
    value: 15,
    type: 'xp',
  },
  {
    id: 2,
    value: 10,
    type: 'coins',
  },
];

export const ChestScreen = ({ navigation }: any) => {
  const appContext = useAppContext();
  const isFocused = useIsFocused();
  const isBlocked = useBlockContent();

  const shakeAnim = useRef(new Animated.Value(0)).current;
  let isMounted = true;

  const [isOpen, setIsOpen] = React.useState(false);
  const [winnerPrize, setWinnerPrize] = React.useState(0);
  const [isOpening, setIsOpening] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [timeout, setTimeout] = React.useState<Moment | null>(null);
  const [user, setUser] = React.useState({
    coins: 0,
    xp: 0,
  });

  const countDown = useCountdown(timeout);

  const openChest = async () => {
    try {
      await backend.post(
        'api/cofre/',
        {},
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      );
      const finalPrize = Math.floor(Math.random() * awards.length);

      addPrize(awards[finalPrize].value, awards[finalPrize].type, finalPrize);
    } catch (error) {}
  };

  const shake = () => {
    if (!isMounted) {
      return;
    }
    setIsOpening(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 6,
      }
    ).start(openChest);
  };

  const exitScreen = () => {
    navigation.goBack();
  };

  const addPrize = async (points: number, type: string, finalPrize: number) => {
    const data: any = {};
    if (type === 'coins') {
      data.coins = user.coins + points;
    } else {
      data.xp = user.xp + points;
    }
    try {
      await backend.patch(`api/usuarios/${appContext.user.id}/`, data, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      });
      if (isMounted) {
        setWinnerPrize(finalPrize);
        setIsOpen(true);
      }
    } catch (error) {}
  };

  const fetchUserDetails = async () => {
    await backend
      .get(`api/usuarios/${appContext.user.id}/`, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((response) => {
        if (isMounted) {
          setUser(response.data);
        }
      });
  };

  const fetchStatus = async () => {
    setIsFetching(true);
    try {
      await backend.get('api/cofre/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      });
    } catch (error: any) {
      if (error?.response?.data) {
        setTimeout(moment(error.response.data).add(24, 'hours'));
      }
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchUserDetails();
  }, [isFocused, isOpen]);

  useEffect(() => {
    fetchStatus();
  }, []);

  if (isBlocked) {
    return (
      <View style={{ flex: 1 }}>
        <BlockedContent />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pointsContainer}>
        <Text style={styles.exp}>{user.xp} EXP</Text>
        <UvaCoins isSmall={true} points={user.coins} />
      </View>
      {/* <HeaderText>¡Obtén más puntos!</HeaderText> */}
      <View style={{ alignItems: 'center', marginVertical: theme.marginY * 2 }}>
        <TitleText>Posibles recompensas: </TitleText>
        <View style={styles.row}>
          {[awards[0], awards[10], awards[13]].map((prize, index) => (
            <TextHolder style={[styles.prize]} key={index}>
              {prize.type === 'coins' ? (
                <UvaCoins points={prize.value} />
              ) : (
                <XpPoints points={prize.value} />
              )}
            </TextHolder>
          ))}
        </View>
      </View>
      <View style={styles.bottom}>
        <Animated.View
          style={[
            styles.chest,
            {
              transform: [
                {
                  translateX: shakeAnim,
                },
              ],
            },
          ]}
        >
          <Image
            resizeMode="contain"
            source={
              isOpen
                ? require('../assets/images/open_chest.png')
                : require('../assets/images/chest.png')
            }
            style={styles.image}
          />
        </Animated.View>
        {isFetching ? (
          <Loader size="large" />
        ) : isOpen ? (
          <View>
            <View style={[styles.center, styles.row]}>
              <TitleText>¡ Has ganado</TitleText>
              {awards[winnerPrize].type === 'points' ? (
                <UvaCoins points={awards[winnerPrize].value} />
              ) : (
                <XpPoints points={awards[winnerPrize].value} />
              )}
              <TitleText>!</TitleText>
            </View>
            <SecondaryButton text="Salir" handlePress={exitScreen} />
          </View>
        ) : (
          !isOpen &&
          !isOpening &&
          timeout === null && <PrimaryButton text="ABRIR" handlePress={shake} />
        )}
        {!isFetching && timeout !== null && (
          <View style={{ alignItems: 'center' }}>
            <TitleText>Siguiente cofre disponible en:</TitleText>
            {countDown[0] === 0 && countDown[1] === 0 && countDown[2] === 0 ? (
              <Loader />
            ) : (
              <TitleText>
                {countDown[1]}h : {countDown[2]}m : {countDown[3]}s
              </TitleText>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 190,
    width: 300,
  },
  prize: {
    width: 110,
    height: 90,
    borderRadius: theme.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.marginX,
  },
  row: {
    flexDirection: 'row',
  },
  key: {
    padding: theme.paddingMd,
  },
  chest: {
    marginVertical: theme.marginX,
  },
  bottom: { marginTop: 40, alignItems: 'center' },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  exp: {
    marginRight: theme.marginX,
    color: primaryColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
