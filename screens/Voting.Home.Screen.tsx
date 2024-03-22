import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  Container,
  TextHolder,
  ScrollView,
  MaterialCommunityIcons,
} from '../components/Themed';

import { HeaderText, TitleText } from '../components/StyledText';
import { theme } from '../constants/Theme';
import { backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';
import { useIsFocused } from '@react-navigation/native';
import { ThemeContext } from '../Theme.Provider';
import { Voting } from '../types';

export function VotingHomeSrcreen({ navigation }: any) {
  const appContext = useAppContext();
  const isFocused = useIsFocused();
  const { primaryColor } = useContext(ThemeContext);

  const [votingList, setVotingList] = useState<Voting[]>([]);

  const fetchVoting = async () => {
    await backend
      .get('api/votaciones/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((res) => setVotingList(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchVoting();
  }, [isFocused]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderText>¡Participa en las votaciones!</HeaderText>
      {votingList.map((item: Voting) => (
        <TouchableOpacity
          style={{ marginVertical: theme.marginY }}
          key={Math.random()}
          onPress={() => {
            navigation.navigate('VotingDetails', {
              userId: appContext.user.id,
              votingId: item.id,
            });
          }}
        >
          <Container style={styles.itemContainer}>
            <TitleText>{item.title}</TitleText>
            <TextHolder style={{ padding: theme.paddingSm }}>
              <Text style={{ textAlign: 'center' }}>{item.description}</Text>
            </TextHolder>
            {item.voted && (
              <Text style={[styles.labelText, { color: primaryColor }]}>
                Ya enviaste tu voto{' '}
                <MaterialCommunityIcons
                  name="check"
                  color={primaryColor}
                  size={18}
                />
              </Text>
            )}
          </Container>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: theme.marginX,
    padding: theme.paddingMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    alignSelf: 'flex-end',
    marginVertical: theme.marginY,
  },
});
