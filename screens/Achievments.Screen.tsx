import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import React, { useRef } from 'react';
import {
  Container,
  MaterialCommunityIcons,
  ScrollView,
  Text,
  TextHolder,
  View,
} from '../components/Themed';
import { HeaderText, TitleText } from '../components/StyledText';
import { theme } from '../constants/Theme';
import { primaryColor } from '../constants/Colors';
import { UvaCoins } from '../components/Uva.Coins';
import { backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';
import { AlertModal } from '../components/Alert.Modal';
import { UserAchievment } from '../types';

export function AchievmentsScreen() {
  const [achievments, setAchievments] = React.useState<UserAchievment[]>([]);
  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);
  const [pointsGained, setPointsGained] = React.useState<number>(0);

  const appContext = useAppContext();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  let isMounted = true;

  const fetchAchievments = async () => {
    try {
      const res = await backend.get('/api/logros/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      });
      setAchievments(res.data);
    } catch (error) {}
  };

  const handleClaim = async (achievment: UserAchievment) => {
    try {
      await backend.post(
        '/api/reclamar_logro/',
        {
          id_empleado: appContext.user.id,
          achievement: achievment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      );
      setModalVisible(true);
      setPointsGained(achievment.achievement.points);
    } catch (error) {}
  };

  const shake = () => {
    if (isMounted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 5,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,

            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  };

  React.useEffect(() => {
    shake();
    fetchAchievments();
    return () => {
      isMounted = false;
    };
  }, [isModalVisible]);

  return (
    <ScrollView>
      <HeaderText>¡Alcanza logros y gana puntos!</HeaderText>
      {achievments.map((item, index) => (
        <Container style={styles.achievementContainer} key={index}>
          <View style={styles.row}>
            <TitleText style={{ marginHorizontal: 0 }}>
              {item.achievement.title}
            </TitleText>

            {item.completed ? (
              <MaterialCommunityIcons
                style={{ marginLeft: 10 }}
                name="check"
                size={24}
                color={primaryColor}
              />
            ) : item.progress >= item.achievement.objective ? (
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: shakeAnim,
                    },
                  ],
                }}
              >
                <TouchableOpacity onPress={() => handleClaim(item)}>
                  <TextHolder
                    style={{
                      padding: 10,
                      borderRadius: 100,
                      marginLeft: 10,
                      borderColor: primaryColor,
                      borderWidth: 2,
                      marginVertical: 10,
                    }}
                  >
                    <UvaCoins points={item.achievement.points} isSmall={true} />
                  </TextHolder>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <UvaCoins points={item.achievement.points} isSmall={true} />
            )}
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={styles.text}>{item.achievement.description}</Text>
            <Text style={styles.text}>
              {item.progress}/{item.achievement.objective}
            </Text>
          </View>
          {/* <View style={styles.progressBar} /> */}
          <Container style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${
                    (item.progress / item.achievement.objective) * 100
                  }%`,
                },
              ]}
            />
          </Container>
        </Container>
      ))}
      <AlertModal
        points={pointsGained}
        visible={isModalVisible}
        onPress={() => {
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  achievementContainer: {
    padding: theme.paddingSm,
    marginVertical: theme.marginY,
    marginHorizontal: theme.marginX,
  },
  text: {
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 20,
    borderRadius: 50,
    marginTop: theme.marginY,
  },

  progressBar: {
    borderRadius: 50,
    height: 15,
    backgroundColor: primaryColor,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
