import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View as DefaultView,
  Share,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  TextHolder,
  ScrollView,
  Text,
  MaterialCommunityIcons,
  Container,
} from '../components/Themed';
import { HeaderText, TitleText } from '../components/StyledText';
import { UvaCoins } from '../components/Uva.Coins';
import { Loader } from '../components/Loader';

import { backend } from '../constants/Backend';
import { theme } from '../constants/Theme';
import { PrimaryButton } from '../components/Primary.Button';

import { TriviaQuestion, TriviaResult } from '../types';

import { useAppContext } from '../App.Provider';
import { usePreventScreenCapture } from 'expo-screen-capture';

import { XpPoints } from '../components/Xp.Points';

interface QuizScreenProps {
  route: {
    params: {
      quiz: TriviaQuestion[];
      maxPoints: number;
      triviaName: string;
      results: TriviaResult[];
      inTime: boolean;
      triviaId: string;
      type: 'training' | 'normal';
    };
  };
  navigation: any;
}

export const TriviaResultScreen = ({ route, navigation }: QuizScreenProps) => {
  const appContext = useAppContext();
  usePreventScreenCapture();

  const { quiz, maxPoints, triviaName, results, inTime, triviaId, type } =
    route.params;

  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const submitResults = async (points: number) => {
    await backend
      .post(
        `api/resultado_trivias/`,
        {
          coins_earned: points,
          user: appContext.user.id,
          trivia: triviaId,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onShare = async () => {
    const data = {
      title: triviaName,
      results: route.params.results.map((result: TriviaResult) =>
        result.is_correct ? '✅' : '❌'
      ),
    };
    const message = `Acabo de contestar la trivia\n${
      data.title
    }!\n\nMis resultados:\n${data.results.join(
      ''
    )}\n\nPuntos ganados: 🍇${coins}\n\nhttps://play.google.com/store/apps/details?id=com.innoval.comalta`;
    try {
      await Share.share({
        message: message,
      });
    } catch (error) {}
  };

  useEffect(() => {
    const totalPoints = Math.round(
      (results.filter((answer: TriviaResult) => answer.is_correct).length *
        maxPoints) /
        quiz.length
    );
    setCoins(totalPoints);
    submitResults(totalPoints);
  }, []);

  const handleBack = () => {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <DefaultView style={{ flex: 1, justifyContent: 'center' }}>
          <Loader size="large" />
        </DefaultView>
      ) : (
        <>
          <HeaderText style={styles.header}>Tus resultados:</HeaderText>
          <DefaultView style={styles.results}>
            <TextHolder style={styles.quizContainer}>
              {results.map((result, index: number) => (
                <DefaultView key={index}>
                  <Text style={[styles.question, styles.text]}>
                    {index + 1}. {result.question.text}
                  </Text>
                  <Text style={styles.text}>
                    {result.text} {result.is_correct ? ' ✅' : ' ❌'}
                  </Text>
                  {type === 'training' && !result.is_correct && (
                    <Container style={{ paddingHorizontal: 5 }}>
                      <Text style={styles.text}>
                        Respuesta correcta: {quiz[index].correct_answer}
                      </Text>
                    </Container>
                  )}
                </DefaultView>
              ))}
              {!inTime && (
                <Text style={[styles.question, styles.text]}>
                  El tiempo se acabó y no pudiste contestar las demas preguntas
                  😔
                </Text>
              )}
            </TextHolder>
            <DefaultView style={styles.reward}>
              <TitleText>Recompensas:</TitleText>
              <UvaCoins points={coins} />
              <XpPoints points={coins} />
            </DefaultView>
            <TouchableOpacity onPress={onShare} style={styles.reward}>
              <MaterialCommunityIcons
                style={{ marginLeft: theme.marginX }}
                name="share-variant"
                size={22}
              />
              <TitleText>Compartir</TitleText>
            </TouchableOpacity>
          </DefaultView>
          <PrimaryButton
            text="TERMINAR"
            handlePress={() => {
              navigation.navigate('TriviaScreenHome');
            }}
            isLoading={false}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 100,
  },
  text: {
    marginVertical: theme.marginY,
    fontSize: 18,
  },
  results: {
    marginVertical: 30,
  },
  quizContainer: {
    padding: theme.paddingSm,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
  question: {
    fontWeight: 'bold',
  },
  answer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
