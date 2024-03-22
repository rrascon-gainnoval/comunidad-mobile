import React from 'react';

import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Text } from './Themed';
import { theme } from '../constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import { primaryColor } from '../constants/Colors';

const colorSet = [
  ['#67D85B', primaryColor],
  ['#5763CA', '#429ED2'],
  ['#C57CDE', '#EF93CA'],
];

type AdvertiseCardProps = {
  colorSet: number;
  title: string;
  description: string;
  terms: string | null;
  image: string | null;
  link: string | null;
};

export const AdvertiseCard = (props: AdvertiseCardProps) => {
  return props.image ? (
    <TouchableOpacity
      onPress={async () => {
        const url = props.link;

        if (url) {
          const supported = await Linking.canOpenURL(url);

          if (supported) {
            await Linking.openURL(url);
          }
        }
      }}
      style={[
        styles.margins,
        {
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <ImageBackground
        source={{ uri: props.image }}
        resizeMethod="resize"
        resizeMode="stretch"
        style={styles.image}
        imageStyle={{
          borderRadius: theme.borderRadius,
        }}
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={async () => {
        const url = props.link;

        if (url) {
          const supported = await Linking.canOpenURL(url);

          if (supported) {
            await Linking.openURL(url);
          }
        }
      }}
    >
      <LinearGradient
        colors={colorSet[props.colorSet]}
        style={[styles.container, styles.margins]}
        start={{ x: 1, y: 0 }}
      >
        <Text style={[styles.text, styles.title]}>{props.title}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.text}>{props.description}</Text>
        </View>
        {props.terms && (
          <Text style={[styles.text, styles.terms]}>{props.terms}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: 290,
    borderRadius: theme.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.paddingSm,
  },
  margins: {
    marginHorizontal: theme.marginX,
    marginVertical: theme.marginY,
  },
  title: {
    fontSize: 18,
    margin: theme.marginY,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionContainer: {
    padding: theme.paddingSm,
    backgroundColor: 'rgba(248,248,250,0.1)',
    borderRadius: theme.borderRadius,
  },
  terms: { fontWeight: 'normal', marginTop: theme.marginY, fontSize: 12 },
  image: {
    height: 180,
    width: 290,
    alignSelf: 'center',
    borderRadius: theme.borderRadius,
  },
});
