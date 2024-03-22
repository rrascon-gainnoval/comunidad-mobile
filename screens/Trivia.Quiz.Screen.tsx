import React, { useState, useEffect, useContext, useMemo } from 'react';
import { CommonActions } from '@react-navigation/native';

import { BackHandler, StyleSheet, TouchableOpacity } from 'react-native';
import {
  View,
  Text,
  ScrollView,
  MaterialCommunityIcons,
} from '../components/Themed';
import { TitleText } from '../components/StyledText';
import { ClockTimer } from '../components/Trivia.Timer';
import { PrimaryButton } from '../components/Primary.Button';
import { Container } from '../components/Themed';
import { Audio } from 'expo-av';

import { theme } from '../constants/Theme';

import { TriviaQuestion, TriviaResult } from '../types';
import { ThemeContext } from '../Theme.Provider';
import { useBlockContent } from '../hooks/useBlockContent';
import { BlockedContent } from '../components/Blocked.Content';
import { shuffleArray } from '../utils/arrays';

interface QuizScreenProps {
  route: {
    params: {
      quiz: TriviaQuestion[];
      maxPoints: number;
      title: string;
      triviaId: string;
      type: string;
    };
  };
  navigation: any;
}

export const QuizScreen = ({ route, navigation }: QuizScreenProps) => {
  const { quiz, maxPoints, title, triviaId, type } = route.params;

  const { primaryColor } = useContext(ThemeContext);
  const isBlocked = useBlockContent();

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [sound, setSound] = useState<any>();
  const [results, setResults] = useState<TriviaResult[]>([]);
  const [notInTime, setNotInTime] = useState(true);

  const currentQuestion = quiz[currentQuestionIndex];

  const answers = useMemo(
    () =>
      shuffleArray([
        currentQuestion.incorrect_answer_1,
        currentQuestion.incorrect_answer_2,
        currentQuestion.incorrect_answer_3,
        currentQuestion.correct_answer,
      ]),
    [currentQuestion]
  );

  const handlePressAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleCommitAnswer = (answer: string) => {
    let currentResults = [
      ...results,
      {
        text: answer,
        question: currentQuestion,
        is_correct: answer === currentQuestion.correct_answer,
      },
    ];
    if (answer === currentQuestion.correct_answer) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    if (currentQuestionIndex === quiz.length - 1) {
      setNotInTime(false);
      navigation.navigate('TriviaResult', {
        triviaName: title,
        quiz: quiz,
        results: currentResults,
        maxPoints: maxPoints,
        inTime: true,
        triviaId,
        type,
      });
    } else {
      setResults((current) => {
        const newResult = [
          ...current,
          {
            text: answer,
            question: currentQuestion,
            is_correct: answer === currentQuestion.correct_answer,
          },
        ];
        return newResult;
      });
      setSelectedAnswer('');
      let next = currentQuestionIndex + 1;
      setCurrentQuestionIndex(next);
    }
  };

  async function playSound(effect: string) {
    const { sound } = await Audio.Sound.createAsync(
      effect === 'correct'
        ? require('../assets/sounds/correct.mp3')
        : effect === 'wrong'
        ? require('../assets/sounds/wrong.mp3')
        : require('../assets/sounds/time_over.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  }

  const handleTimeOver = () => {
    if (notInTime) {
      playSound('time_over');
      navigation.navigate('TriviaResult', {
        triviaName: title,
        quiz: quiz,
        results: results,
        maxPoints: maxPoints,
        inTime: !notInTime,
        triviaId,
        type,
      });
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    return () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'TriviaScreenHome' }],
        })
      );
    };
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

  if (isBlocked) {
    return (
      <View style={{ flex: 1 }}>
        <BlockedContent />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {isStarted ? (
        <>
          <View style={styles.quizDetails}>
            <Text style={[styles.currentQuestion, { color: primaryColor }]}>
              Pregunta {currentQuestionIndex + 1}/{quiz.length}
            </Text>
            <ClockTimer
              seconds={quiz.length * 8}
              isRunning={true}
              handleTimeOver={handleTimeOver}
            />
          </View>
          <TitleText style={styles.question}>{currentQuestion.text}</TitleText>
          <View>
            {answers.map((answer: string) => (
              <Container
                style={[
                  styles.answerContainer,
                  selectedAnswer === answer && { borderColor: primaryColor },
                ]}
                key={answer}
              >
                <TouchableOpacity
                  style={styles.answer}
                  onPress={() => {
                    handlePressAnswer(answer);
                  }}
                >
                  <Text>{answer}</Text>
                </TouchableOpacity>
              </Container>
            ))}
          </View>
          {selectedAnswer !== '' && (
            <PrimaryButton
              text="ELEGIR"
              handlePress={() => {
                handleCommitAnswer(selectedAnswer);
              }}
              isLoading={false}
            />
          )}
        </>
      ) : (
        <View style={styles.startContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsStarted(true);
            }}
            style={styles.playContainer}
          >
            <View
              style={[styles.playButton, { backgroundColor: primaryColor }]}
            >
              <MaterialCommunityIcons name="play" size={32} />
            </View>
            <TitleText>EMPEZAR</TitleText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quizDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.marginX,
    marginVertical: 20,
  },
  currentQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  question: {
    textAlign: 'center',
    fontWeight: 'normal',
  },
  answerContainer: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
  answer: {
    padding: theme.paddingMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  playContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.marginY * 5,
  },
});
