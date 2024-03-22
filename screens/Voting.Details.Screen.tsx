import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import {
  Container,
  MaterialCommunityIcons,
  ScrollView,
  Text,
  TextHolder,
  View,
} from '../components/Themed';
import { TitleText } from '../components/StyledText';

import { PrimaryButton } from '../components/Primary.Button';
import { AlertModal } from '../components/Alert.Modal';

import { theme } from '../constants/Theme';
import { backend } from '../constants/Backend';
import { ThemeContext } from '../Theme.Provider';
import { Voting, VotingChoice } from '../types';
import { Loader } from '../components/Loader';
import { useAppContext } from '../App.Provider';
import { linkColor } from '../constants/Colors';

const windowWidth = Dimensions.get('window').width;

export function VotingDetailsScreen({ route, navigation }: any) {
  const [selectedOption, setSelectedOption] = useState<VotingChoice | null>(
    null
  );
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [voting, setVoting] = useState<Voting | null>(null);
  const [imageToDisplay, setImageToDisplay] = useState<string>('');

  const totalVotes = voting
    ? voting.choices.reduce((acc, cur) => acc + cur.votes, 0)
    : 0;

  const { primaryColor } = useContext(ThemeContext);
  const appContext = useAppContext();

  const { votingId } = route.params;

  const handleSubmit = async () => {
    if (!selectedOption || !voting) {
      return;
    }

    backend
      .post(
        'api/votacion/',
        {
          user: appContext.user.id,
          choice: selectedOption.id,
          poll: voting.id,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      )
      .then(() => setShowAlert(true));
  };

  const fetchDetails = async () => {
    backend
      .get(`api/votaciones/${votingId}/`, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((res) => {
        setVoting(res.data);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (!voting) {
    return (
      <View style={{ flex: 1 }}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Image
        style={styles.icon}
        resizeMode="contain"
        source={require('../assets/images/vote.png')}
      />
      <TitleText style={[styles.title, { color: primaryColor }]}>
        {voting.title}
      </TitleText>
      <Text style={{ marginHorizontal: theme.marginX }}>
        {voting.description}
      </Text>

      {!voting.voted &&
        voting.choices?.map((option) => (
          <TouchableOpacity
            onPress={() => setSelectedOption({ ...option })}
            key={Math.random()}
          >
            <Container
              style={[
                styles.option,
                selectedOption &&
                  selectedOption.id === option.id && {
                    borderColor: primaryColor,
                  },
              ]}
            >
              <Text>{option.text}</Text>
              {option.image && (
                <Image style={styles.img} source={{ uri: option.image }} />
              )}
            </Container>
          </TouchableOpacity>
        ))}

      {voting.voted &&
        voting.choices.map((option) => (
          <Container key={Math.random()} style={styles.porcentageContainer}>
            <View>
              <TextHolder
                style={[
                  styles.porcentageBg,
                  totalVotes !== 0 && {
                    width: ((option.votes * 100) / totalVotes).toFixed() + '%',
                  },
                ]}
              />
              <Text style={styles.porcentageText}>{option.text}</Text>
              <Text
                style={[
                  styles.porcentageText,
                  {
                    right: theme.marginX,
                  },
                ]}
              >
                {`(${option.votes} votos)   `}
                {totalVotes !== 0
                  ? ((option.votes * 100) / totalVotes).toFixed() + '%'
                  : '0%'}
              </Text>
            </View>
            {option.image && (
              <Pressable onPress={() => setImageToDisplay(option.image)}>
                <Text style={styles.link}>Ver imagen</Text>
              </Pressable>
            )}
          </Container>
        ))}

      {selectedOption ? (
        <PrimaryButton
          style={{ marginTop: 50 }}
          handlePress={handleSubmit}
          text="Votar"
        />
      ) : null}

      {imageToDisplay && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
        >
          <Pressable
            onPress={() => setImageToDisplay('')}
            style={{
              padding: theme.paddingSm,
              marginLeft: 'auto',
            }}
          >
            <MaterialCommunityIcons color={'black'} size={24} name="close" />
          </Pressable>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Image
              style={{
                width: windowWidth,
                height: '100%',
                resizeMode: 'contain',
              }}
              source={{ uri: imageToDisplay }}
            />
          </View>
        </View>
      )}

      <AlertModal
        onPress={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
        icon="check-circle"
        iconColor={primaryColor}
        text="Votacion enviada con exito"
        visible={showAlert}
        onRequestClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 20,
  },
  option: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    padding: theme.paddingMd,
  },
  icon: {
    height: 80,
    marginVertical: theme.marginY,
    alignSelf: 'center',
  },
  porcentageBg: {
    height: 55,
    justifyContent: 'center',
  },
  porcentageContainer: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    height: 90,
  },
  porcentageText: {
    marginLeft: theme.marginX,
    position: 'absolute',
    top: 15,
  },
  img: {
    marginTop: theme.marginX,
    resizeMode: 'cover',
    height: 200,
  },
  link: {
    fontWeight: 'bold',
    color: linkColor,
    alignSelf: 'center',
    padding: 5,
  },
});
