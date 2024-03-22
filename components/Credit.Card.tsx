import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryColor } from '../constants/Colors';
import { TitleText } from './StyledText';

export function CreditCard({ holdersName }) {
  return (
    <LinearGradient
      colors={['#67D85B', primaryColor]}
      style={[styles.card, { backgroundColor: primaryColor }]}
      start={{ x: 1, y: 0 }}
    >
      <TitleText style={{ color: '#FAFAFA' }}>CRÉDITO SUPERALTA</TitleText>
      <View style={[styles.cardMiddle, styles.rowBetween]}>
        <Image
          style={styles.chip}
          source={require('../assets/images/chip.png')}
        />
        <TitleText style={[styles.metalicText, styles.cardDetails]}>
          00/00
        </TitleText>
      </View>
      <TitleText style={[styles.metalicText, styles.cardDetails]}>
        {holdersName}
      </TitleText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '95%',
    height: 240,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
    marginVertical: 30,
    alignSelf: 'center',
    maxWidth: 360,
  },
  metalicText: {
    color: '#FAFAFA',
    textShadowColor: '#A8A6A6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  cardDetails: { fontSize: 16 },
  chip: {
    height: 40,
    width: 40,
    marginLeft: 10,
  },
  cardMiddle: {
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
