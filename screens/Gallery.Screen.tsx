import { Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { ScrollView } from '../components/Themed';
import { ImageGallery } from '../components/Image.Gallery';
import { theme } from '../constants/Theme';
import type { EventImage } from '../types';

export function GalleryScreen({ route }: any) {
  const { images, event } = route.params;
  const [galleryVisible, setGalleryVisible] = React.useState(false);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.map((item: EventImage) => (
        <TouchableOpacity
          key={Math.random()}
          onPress={() => setGalleryVisible(true)}
        >
          <Image style={styles.image} source={{ uri: item.image }} />
        </TouchableOpacity>
      ))}
      <ImageGallery
        shareText={`Checa esta imagen del evento ${event.nombre}:`}
        images={images}
        visible={galleryVisible}
        handlePress={() => setGalleryVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: theme.paddingMd,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width / 3 - 4,
    height: Dimensions.get('window').width / 3,
    margin: 2,
  },
});
