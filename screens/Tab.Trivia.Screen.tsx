import React from 'react';

import { FlatList, StyleSheet, View } from 'react-native';
import { ScrollView } from '../components/Themed';
import { HeaderText } from '../components/StyledText';
import { TriviaCard } from '../components/Trivia.Card';
import { Loader } from '../components/Loader';

import { UnavailableContent } from '../components/Unavailable.Content';

import { useTriviasList } from '../hooks/useTriviasList';
import { BlockedContent } from '../components/Blocked.Content';
import { useBlockContent } from '../hooks/useBlockContent';

export function TabTriviaScreen(props: any) {
  const trivias = useTriviasList();
  const isBlocked = useBlockContent();

  if (isBlocked) {
    return (
      <View style={{ flex: 1 }}>
        <BlockedContent />
      </View>
    );
  }

  return (
    <>
      {trivias.wasFetchError ? (
        <UnavailableContent
          content="Trivias"
          onPressRetry={() => {
            trivias.fetchTrivias();
          }}
        />
      ) : (
        <ScrollView style={styles.container}>
          {trivias.isLoading ? (
            <Loader size="large" />
          ) : (
            <>
              <HeaderText style={styles.header}>
                ¡Contesta y gana puntos!
              </HeaderText>

              <FlatList
                scrollEnabled={false}
                data={trivias.list}
                renderItem={({ item }) => (
                  <TriviaCard
                    title={item.title}
                    description={item.description}
                    points={item.points_to_win}
                    quiz={item.questions}
                    done={item.is_completed}
                    handlePress={() => {
                      props.navigation.navigate('TriviaScreenQuiz', {
                        quiz: item.questions,
                        title: item.title,
                        maxPoints: item.points_to_win,
                        triviaId: item.id,
                        type: item.type,
                      });
                    }}
                  />
                )}
              />
            </>
          )}
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginVertical: 20,
  },
});
