import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, Text, View } from './Themed';
import { TitleText } from './StyledText';
import { theme } from '../constants/Theme';
import * as Animatable from 'react-native-animatable';
import { backend } from '../constants/Backend';
import { useAppContext } from '../App.Provider';

const textColor = '#F2F2F2';
const signColor = '#EA4545';

type FunfactModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

type FunFact = {
  id: string;
  body: string;
};

export function FunfactModal({ isVisible, onClose }: FunfactModalProps) {
  const appContext = useAppContext();
  const [funFacts, setFunFacts] = React.useState<FunFact[]>([]);

  const randomIndex = Math.floor(Math.random() * funFacts.length);

  const fetchFunFact = async () => {
    try {
      const res = await backend.get('api/sabiasque/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      });
      setFunFacts([...res.data]);
    } catch (error) {}
  };

  React.useEffect(() => {
    fetchFunFact();

    return () => {};
  }, []);

  if (!isVisible) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Animatable.View
        animation={'bounceInRight'}
        duration={1500}
        style={styles.sign}
      >
        <TouchableOpacity onPress={onClose}>
          <MaterialCommunityIcons name="close" size={24} color={textColor} />
        </TouchableOpacity>
        <View style={styles.timmyContainer}>
          <Image
            resizeMode="contain"
            style={styles.img}
            source={require('../assets/images/timmy.png')}
          />
        </View>
        <TitleText
          style={{
            color: textColor,
            marginHorizontal: 0,
            marginTop: theme.marginY * 2,
          }}
        >
          {'¿Sabías qué?'}
        </TitleText>
        <Text style={{ color: textColor, textAlign: 'justify' }}>
          {funFacts[randomIndex]?.body}
        </Text>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sign: {
    backgroundColor: signColor,
    width: '99%',
    position: 'absolute',
    right: -5,
    top: 250,
    borderRadius: theme.borderRadius * 2,
    padding: theme.paddingMd,
    paddingRight: 100,
    minHeight: 200,
  },
  timmyContainer: {
    backgroundColor: signColor,
    width: 150,
    height: 150,
    right: -5,
    top: -100,
    borderRadius: 150,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: 150,
  },
});
