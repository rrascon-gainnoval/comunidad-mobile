import React, { useEffect, useState, useCallback } from 'react';

import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Text,
  ScrollView,
  View,
  TextHolder,
} from '../components/Themed';

import { backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';
import { theme } from '../constants/Theme';
import { UnavailableContent } from '../components/Unavailable.Content';
import { XpPoints } from '../components/Xp.Points';
import { User } from '../types';

export const RankingHome = ({ navigation }: any) => {
  const [ranking, setRanking] = useState<User[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('mine');
  const [loading, setLoading] = useState<boolean>(true);

  const appContext = useAppContext();

  const top1 = ranking[0];
  const top2 = ranking[1];
  const top3 = ranking[2];

  const fetchRanking = useCallback(async () => {
    setLoading(true);

    await backend
      .get(`api/puntuaciones/${selectedItem === 'all' ? '?campo=todos' : ''}`, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((response) => {
        setRanking([...response.data]);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  }, [selectedItem]);

  useEffect(() => {
    fetchRanking();
    return () => {};
  }, [selectedItem]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* menu start */}
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem('mine');
          }}
        >
          <TextHolder
            style={[
              styles.menuItem,
              selectedItem !== 'mine' ? { opacity: 0.5 } : { opacity: 1 },
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>Mi campo</Text>
          </TextHolder>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem('all');
          }}
        >
          <TextHolder
            style={[
              styles.menuItem,
              selectedItem !== 'all' ? { opacity: 0.5 } : { opacity: 1 },
            ]}
          >
            <Text style={{ fontWeight: 'bold' }}>Todos</Text>
          </TextHolder>
        </TouchableOpacity>
      </View>
      {/* menu end */}

      {/* medals start */}
      {ranking.length > 0 && !loading ? (
        <>
          <View style={styles.topUsers}>
            <View style={styles.topContainer}>
              <Container style={styles.iconBorder}>
                <Image
                  source={require('../assets/images/medal_silver.png')}
                  style={styles.badge}
                />
                <Image
                  source={{ uri: top2?.icon }}
                  style={styles.img}
                  resizeMode="contain"
                />
              </Container>
              <Text style={styles.bold}>{top2?.first_name.split(' ')[0]}</Text>
            </View>
            <View style={styles.topContainer}>
              <Container style={styles.imgCenter}>
                <Image
                  source={require('../assets/images/medal_gold.png')}
                  style={[styles.badge, { left: -10 }]}
                />
                <Image
                  source={{ uri: top1?.icon }}
                  style={[styles.img, { height: 80, width: 80 }]}
                  resizeMode="contain"
                />
              </Container>
              <Text style={styles.bold}>{top1?.first_name.split(' ')[0]}</Text>
            </View>
            <View style={styles.topContainer}>
              <Container style={styles.iconBorder}>
                <Image
                  source={require('../assets/images/medal_bronze.png')}
                  style={styles.badge}
                />
                <Image
                  source={{ uri: top3?.icon }}
                  style={styles.img}
                  resizeMode="contain"
                />
              </Container>
              <Text style={styles.bold}>{top3?.first_name.split(' ')[0]}</Text>
            </View>
          </View>
          {/* medals end */}

          <View style={styles.tableHeader}>
            <Text style={styles.bold}></Text>
            <Text style={styles.bold}>Puntos</Text>
          </View>

          {ranking.map((user: User, index) => (
            <Container style={styles.userCard} key={user.id}>
              <Text style={styles.bold}>{index + 1}</Text>
              <Image source={{ uri: user.icon }} style={styles.profileIcon} />
              <Text numberOfLines={1} style={styles.bold}>
                {user.first_name} {user.last_name}
              </Text>
              <View
                style={{
                  marginLeft: 'auto',
                }}
              >
                <XpPoints points={user.xp} isSmall={true} />
              </View>
            </Container>
          ))}
        </>
      ) : (
        <UnavailableContent
          description="El ranking no está disponible"
          onPressRetry={fetchRanking}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  img: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  topUsers: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 40,
  },
  iconBorder: {
    borderRadius: 50,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCenter: {
    borderRadius: 100,
    alignItems: 'center',
    marginTop: -30,
    justifyContent: 'center',
    height: 90,
    width: 90,
    marginHorizontal: 50,
  },
  badge: {
    height: 40,
    width: 40,
    borderRadius: 15,
    position: 'absolute',
    zIndex: 1,
    top: -10,
    left: -20,
  },
  bold: {
    fontWeight: 'bold',
    marginTop: theme.marginY,
  },
  topContainer: {
    alignItems: 'center',
  },
  userCard: {
    marginBottom: theme.marginY,
    marginHorizontal: theme.marginX,
    flexDirection: 'row',
    padding: theme.paddingSm,
    alignItems: 'center',
    gap: theme.paddingSm,
  },
  menu: {
    marginHorizontal: theme.marginX,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginVertical: theme.marginY,
  },
  menuItem: {
    padding: theme.paddingSm,
    borderRadius: 100,
  },
  profileIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  tableHeader: {
    margin: theme.marginX,
    marginTop: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
