import React from 'react';
import {
  StyleSheet,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { theme } from '../constants/Theme';
import { MaterialCommunityIcons, ScrollView } from './Themed';

import { Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';

import colors from '../constants/Colors';
import { EventImage } from '../types';

const width = Dimensions.get('window').width;

export function ImageGallery(props: any) {
  const { images, visible, handlePress, shareText } = props;
  const eventImages: EventImage[] = images;
  const [selectedImage, setSelectedImage] = React.useState<EventImage>(
    eventImages[0]
  );
  const [isMenuVisible, setIsMenuVisible] = React.useState(true);
  const [scrollOffset, setScrollOffset] = React.useState(0);

  const onShare = async () => {
    try {
      const imageTmp = await ImageManipulator.manipulateAsync(
        selectedImage.image
      );
      await Sharing.shareAsync(imageTmp.uri, {
        dialogTitle: shareText,
      });
    } catch (error) {}
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="black" style="light" />
      <Modal {...props} visible={visible}>
        {isMenuVisible && (
          <View style={[styles.previewContainer, styles.top]}>
            <TouchableOpacity onPress={handlePress}>
              <MaterialCommunityIcons
                style={{ margin: theme.marginX }}
                name="arrow-left"
                size={24}
                color={colors.dark.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare}>
              <MaterialCommunityIcons
                style={{ margin: theme.marginX }}
                name="share-variant"
                size={24}
                color={colors.dark.text}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={(styles.container, {})}>
          <ScrollView
            contentOffset={{ x: scrollOffset, y: 0 }}
            style={{ backgroundColor: 'black' }}
            snapToInterval={width}
            onMomentumScrollEnd={(e) =>
              setSelectedImage(
                eventImages[e.nativeEvent.contentOffset.x / width]
              )
            }
            disableIntervalMomentum={true}
            decelerationRate="fast"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {eventImages.map((item: EventImage, index: number) => (
              <Pressable
                key={index}
                onPress={() => setIsMenuVisible(!isMenuVisible)}
              >
                <Image
                  resizeMode="contain"
                  source={{ uri: item.image }}
                  style={styles.image}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {isMenuVisible && (
          <View style={[styles.previewContainer, { bottom: 0 }]}>
            <FlatList
              horizontal={true}
              data={eventImages}
              disableIntervalMomentum={true}
              snapToInterval={350}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.image}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setScrollOffset(index * width);
                    setSelectedImage(images[index]);
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={[
                      styles.imagePreview,
                      { borderWidth: selectedImage === item ? 2 : 0 },
                      selectedImage === item && { width: 60 },
                    ]}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: '100%',
    backgroundColor: 'black',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  imagePreview: {
    width: 30,
    height: 80,
    marginRight: 4,
    marginTop: 4,
    borderColor: 'white',
  },
  previewContainer: {
    position: 'absolute',
    height: 120,
    paddingHorizontal: theme.paddingSm,
    backgroundColor: 'rgba(28,28,28,.8)',
    width: '100%',
    zIndex: 2,
  },
  top: {
    top: 2,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottom: {
    bottom: 0,
  },
});
