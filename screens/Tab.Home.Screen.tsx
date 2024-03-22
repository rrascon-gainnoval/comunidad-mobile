import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import {
  View,
  ScrollView,
  Container,
  Text,
  TextHolder,
} from '../components/Themed';
import { HeaderText, TitleText } from '../components/StyledText';
import { WeatherCard } from '../components/Weather.Card';
import { AdvertiseReel } from '../components/Advertise.Reel';
import { Loader } from '../components/Loader';
import { TriviaCard } from '../components/Trivia.Card';
import { UnavailableContent } from '../components/Unavailable.Content';

import { Advertise } from '../types';
import { useTriviasList } from '../hooks/useTriviasList';
import { backend } from '../constants/Backend';
import { theme } from '../constants/Theme';
import { useAppContext } from '../App.Provider';
import { getIsFirstTime } from '../utils/storage';
import { FunfactModal } from '../components/Funfact.Modal';
import { NominaDirectAccess } from '../components/Nomina.Direct.Access';

export function TabHomeScreen({ navigation }: any) {
  const [ads, setAds] = useState<Advertise[]>([]);
  const [isFetchingAds, setIsFetchingAds] = useState(true);
  const [adsUnavailable, setAdsUnavailable] = useState(false);
  const [voting, setVoting] = useState<string>('');
  const [isFunfact, setIsFunfact] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const trivias = useTriviasList();
  const appContext = useAppContext();
  let mounted = true;

  /* Add 'colorSet' property to adList */
  const addColorSet = (ads: Advertise[]) => {
    let position = 0;
    ads.forEach((item: Advertise) => {
      position > 2 && (position = 0);
      item.colorSet = position;
      position += 1;
    });
    return ads;
  };

  const fetchAds = useCallback(async () => {
    await backend
      .get('api/noticias/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((response) => {
        setAdsUnavailable(false);
        if (mounted) {
          const adsWithColorSet = addColorSet(response.data.slice(0, 5));
          setAds([...adsWithColorSet]);
          setIsFetchingAds(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setAdsUnavailable(true);
          setIsFetchingAds(false);
        }
      });
  }, []);

  const fetchVoting = async () => {
    await backend
      .get('api/votaciones/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((res) => {
        if (mounted && res.data[0]) setVoting(res.data[0].title);
      })
      .catch(() => {});
  };

  const checkIfFirstTime = async () => {
    const isFirstTime = await getIsFirstTime();
    if (isFirstTime) {
      navigation.getParent().setOptions({ tabBarStyle: { display: 'none' } });
      navigation.navigate('Onboarding');
    }
    return;
  };

  const displayFunfact = async () => {
    if (new Date().getDate() % 2 === 0) {
      setTimeout(() => {
        if (mounted) {
          setIsFunfact(true);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    displayFunfact();
    checkIfFirstTime();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    fetchAds();
    fetchVoting();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetchingAds}
            onRefresh={() => {
              setIsRefreshing(!isRefreshing);
              fetchAds();
              trivias.fetchTrivias();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <HeaderText style={{ alignSelf: 'flex-start' }}>
              ¡Bienvenido{' '}
              {appContext.user.name.charAt(0) +
                appContext.user.name.slice(1).toLowerCase()}
              !
            </HeaderText>
            <TitleText style={{ marginTop: 0, opacity: 0.9 }}>
              lekuk sjulel a wo’tanik (tzotzil)
            </TitleText>
          </View>
          <WeatherCard location={appContext.user.location} />

          {/* Nomina direct access start */}
          <NominaDirectAccess
            handlePress={() => navigation.navigate('NominaHome')}
          />
          {/* Nomina direct access end */}

          {/* News reel start */}
          {ads.length > 0 && <TitleText>Descubre lo nuevo</TitleText>}
          {isFetchingAds ? (
            <Loader size="small" />
          ) : adsUnavailable ? (
            <UnavailableContent
              content="Noticias"
              small={true}
              onPressRetry={fetchAds}
            />
          ) : (
            <AdvertiseReel advertises={ads} />
          )}
          {/* News reel end */}

          {/* voting start */}
          {voting ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('VotingHome', {
                  data: {},
                })
              }
            >
              <Container style={styles.rankingContainer}>
                <Image
                  style={{
                    height: 50,
                  }}
                  resizeMode="contain"
                  source={require('../assets/images/vote.png')}
                />
                <TitleText>{voting}</TitleText>
                <TextHolder style={styles.rankingHolder}>
                  <Text style={{ textAlign: 'center' }}>
                    No te pierdas las ultimas votaciones
                  </Text>
                </TextHolder>
              </Container>
            </TouchableOpacity>
          ) : null}
          {/* voting end */}

          {/* ranking start */}
          <TouchableOpacity onPress={() => navigation.navigate('RankingHome')}>
            <Container style={styles.rankingContainer}>
              <Image
                style={{
                  height: 50,
                }}
                resizeMode="contain"
                source={require('../assets/images/champ.png')}
              />
              <TitleText>Puntuaciones</TitleText>
            </Container>
          </TouchableOpacity>
          {/* ranking end */}

          {/* Trivias start */}
          {trivias.list.length > 0 && <TitleText>Últimas trivias</TitleText>}
          {trivias.isLoading ? (
            <Loader size="small" />
          ) : trivias.wasFetchError ? (
            <UnavailableContent
              content="Trivias"
              small={true}
              onPressRetry={trivias.fetchTrivias}
            />
          ) : (
            <>
              {trivias.list.slice(0, 2).map((item) => (
                <TriviaCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  points={item.points_to_win}
                  quiz={item.questions}
                  done={item.is_completed}
                  handlePress={() => {
                    navigation.navigate('TabTrivia', {
                      screen: 'TriviaScreenQuiz',
                      params: {
                        quiz: item.questions,
                        title: item.title,
                        maxPoints: item.points_to_win,
                        triviaId: item.id,
                        type: item.type,
                      },
                    });
                  }}
                />
              ))}
            </>
          )}
          {/* Trivias end */}
        </View>
      </ScrollView>
      <FunfactModal onClose={() => setIsFunfact(false)} isVisible={isFunfact} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    textAlign: 'justify',
  },
  headerContainer: {
    flexDirection: 'column',
  },
  emoji: {
    fontSize: 55,
  },
  rankingContainer: {
    marginHorizontal: theme.marginX,
    padding: theme.paddingSm,
    alignItems: 'center',
    marginVertical: theme.marginY,
  },
  rankingHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.paddingSm,
  },
});
