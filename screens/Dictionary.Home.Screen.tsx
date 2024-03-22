import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Container, ScrollView, Text, View } from '../components/Themed';
import { HeaderText } from '../components/StyledText';
import { Loader } from '../components/Loader';
import { UnavailableContent } from '../components/Unavailable.Content';

import { Audio } from 'expo-av';

import { theme } from '../constants/Theme';
import { backend } from '../constants/Backend';
import { Picker, PickerItem } from '../components/Data.Picker';
import SearchBar from '../components/Search.Bar';
import type { Language, Translation } from '../types';
import { useAppContext } from '../App.Provider';
import { PlayButton } from '../components/Play.Button';

export function DictionaryHomeScreen() {
  let isMounted = true;
  const appContext = useAppContext();

  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const filteredList = useMemo(
    () => translations.filter((item) => item),
    [searchValue, translations]
  );

  const fetchTranslations = async () => {
    if (!selectedLanguage) {
      return;
    }
    backend
      .get(`api/traducciones/?lenguaje=${selectedLanguage}`, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((res) => {
        isMounted && setTranslations([...res.data]);
        isMounted && setError(false);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        isMounted && setIsLoading(false);
      });
  };

  const fetchLanguages = async () => {
    backend
      .get('api/lenguas/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((res) => {
        isMounted && setLanguages([...res.data]);
      })
      .catch((err) => {
        setTranslations([]);
      })
      .finally(() => {
        isMounted && setIsLoading(false);
      });
  };

  const handlePlayAudio = async (audioUri: string) => {
    const { sound } = await Audio.Sound.createAsync({
      uri: audioUri,
    });
    sound.playAsync();
  };

  useEffect(() => {
    fetchTranslations();
  }, [selectedLanguage]);

  useEffect(() => {
    fetchLanguages();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <HeaderText>¡Comunicate con todos!</HeaderText>
      <Picker
        onValueChange={(value: string) => {
          setSelectedLanguage(value);
        }}
        selectedValue={selectedLanguage}
      >
        <PickerItem label="Selecciona un lenguaje" value="" />
        {languages.map((language: Language) => (
          <PickerItem
            key={language.id}
            label={language.name}
            value={language.id}
          />
        ))}
      </Picker>
      <SearchBar
        onChangeText={(text) => {
          setSearchValue(text);
        }}
        style={{ marginVertical: theme.marginY }}
      />

      {isLoading && <Loader size="large" />}

      {filteredList.map((item) => (
        <Container style={styles.card} key={Math.random()}>
          <View style={{ maxWidth: '70%', gap: theme.paddingSm }}>
            <View>
              <Text style={styles.bold}>{item.first_phrase.phrase}</Text>
              <Text>{item.first_phrase.language.name}</Text>
            </View>

            <View>
              <Text style={styles.bold}>{item.second_phrase.phrase}</Text>
              <Text>{item.second_phrase.language.name}</Text>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'space-between',
              gap: theme.paddingMd,
            }}
          >
            <PlayButton
              onPress={() => handlePlayAudio(item.first_phrase.audio)}
            />
            <PlayButton
              onPress={() => handlePlayAudio(item.second_phrase.audio)}
            />
          </View>
        </Container>
      ))}

      {!error && selectedLanguage && translations.length === 0 && (
        <UnavailableContent
          description={`No hay traducciones con ${
            languages.filter((language) => language.id === selectedLanguage)[0]
              ?.name
          }`}
        />
      )}

      {error && (
        <UnavailableContent description="Hubo un problema al obtener las traducciones" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: theme.paddingMd,
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: 'bold',
  },
});
