import React, { useState, useEffect } from 'react';
import { StyleSheet, RefreshControl, LayoutAnimation } from 'react-native';
import { View, ScrollView, Text } from '../components/Themed';

import { SocialMoodPicker } from '../components/Social.Mood.Picker';
import { SocialMoodCard } from '../components/Social.Mood.Card';

import { backend } from '../constants/Backend';
import { theme } from '../constants/Theme';
import { errorColor } from '../constants/Colors';

import { useAppContext } from '../App.Provider';
import { HeaderText, TitleText } from '../components/StyledText';
import { Loader } from '../components/Loader';
import { BirthdayReel } from '../components/Social.Birthday.Reel';
import { useBlockContent } from '../hooks/useBlockContent';
import { BlockedContent } from '../components/Blocked.Content';
import { BirthDay, SocialPost } from '../types';

export const SocialHomeScreen = () => {
  const appContext = useAppContext();
  const isBlocked = useBlockContent();

  let mounted = true;

  const [selectedMood, setSelectedMood] = useState<string>('contento');
  const [moods, setMoods] = useState<SocialPost[]>([]);
  const [displayLength, setDisplayLength] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [birthdayList, setBirthdayList] = useState<BirthDay[]>([]);

  const fetchMoods = async (fromLike?: boolean) => {
    if (!fromLike) {
      setIsFetching(true);
    }
    await backend
      .get('api/estados/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((response) => {
        if (mounted) {
          setMoods(response.data);
          setIsFetching(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsFetching(false);
        }
      });
  };

  const handleShare = async () => {
    setIsLoading(true);
    await backend
      .post(
        'api/estados/',
        {
          body: selectedMood,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
            'Request-type': 'moodpost',
          },
        }
      )
      .then(() => {
        setTimeout(() => {
          if (mounted) {
            setIsLoading(false);
          }
        }, 500);
      })
      .catch((error) => {
        if (mounted) {
          setIsLoading(false);
          setError(error.response.data);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setTimeout(() => {
            setError('');
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          }, 3500);
        }
      });
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 5;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    setDisplayLength(displayLength + 5);
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 800);
  };

  const likePost = async (id_mood: string) => {
    await backend
      .post(
        'api/me_gusta/',
        {
          post: id_mood,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then(() => {
        fetchMoods();
      });
  };

  const dislikePost = async (user_like_id: string) => {
    await backend
      .delete(`api/me_gusta/${user_like_id}/`, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then(() => {
        fetchMoods();
      });
  };

  const fetchBirthdayList = async () => {
    await backend
      .get('api/cumpleanios/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((res) => {
        if (mounted) {
          setBirthdayList([...res.data]);
        }
      })
      .catch((err) => {});
  };

  const sendCongrats = async (birth_day_user_id: string) => {
    await backend
      .post(
        'api/me_gusta/',
        {
          birth_day_user: birth_day_user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then(() => {
        fetchBirthdayList();
      })
      .catch((err) => {});
  };

  const fetchData = () => {
    fetchMoods();
    fetchBirthdayList();
  };

  useEffect(() => {
    fetchData();
    return () => {
      mounted = false;
    };
  }, [isLoading]);

  if (isBlocked) {
    return (
      <View style={{ flex: 1 }}>
        <BlockedContent />
      </View>
    );
  }

  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          loadMore();
        }
      }}
      scrollEventThrottle={0}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={fetchData} />
      }
      contentContainerStyle={{ paddingBottom: theme.paddingMd }}
    >
      <HeaderText style={{ textAlign: 'left' }}>
        ¡Interactúa y socializa!
      </HeaderText>
      <BirthdayReel
        birthdayList={birthdayList}
        handleCongrats={(birthDay: BirthDay) => {
          if (birthDay.is_liked) {
            return;
          }
          sendCongrats(birthDay.id);
        }}
      />
      <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <SocialMoodPicker
          onPress={setSelectedMood}
          selectedMood={selectedMood}
          handleShare={handleShare}
          isLoading={isLoading}
        />
      </View>
      {!isLoading && moods.length === 0 ? (
        <TitleText style={{ textAlign: 'center' }}>
          No hay publicaciones de hoy.
        </TitleText>
      ) : (
        moods.slice(0, displayLength).map((item) => (
          <SocialMoodCard
            key={Math.random().toString()}
            mood={item}
            handlePress={() => {
              if (item.is_liked) {
                return dislikePost(item.user_like_id);
              }
              return likePost(item.id);
            }}
          />
        ))
      )}
      {isLoadingMore && (
        <Loader style={{ height: 0, marginBottom: 80, marginTop: 10 }} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.paddingMd,
    color: errorColor,
  },
});
