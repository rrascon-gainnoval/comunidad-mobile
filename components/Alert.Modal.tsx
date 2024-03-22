import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

import { View, MaterialCommunityIcons, Text } from './Themed';
import { theme } from '../constants/Theme';
import { UvaCoins } from './Uva.Coins';

type AlertProps = {
  visible: boolean;
  icon?: string;
  iconColor?: string;
  text?: any;
  onPress: () => void;
  onRequestClose?: () => void;
  onContainerPress?: () => void;
  points?: number;
};

export function AlertModal({
  visible,
  icon,
  iconColor,
  text,
  onPress,
  onRequestClose,
  onContainerPress,
  points,
}: AlertProps) {
  return (
    <Modal
      hardwareAccelerated={true}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose ? onRequestClose : () => {}}
    >
      <Pressable
        onPress={onContainerPress ? onContainerPress : () => {}}
        style={styles.modalContainer}
      >
        <View style={styles.modalView}>
          {points ? (
            <View style={{ marginBottom: theme.marginY * 2 }}>
              <Text style={styles.descriptionText}>Has ganado</Text>
              <UvaCoins points={points} />
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons color={iconColor} name={icon} size={80} />
              <Text style={styles.descriptionText}>{text}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.buttonClose} onPress={onPress}>
            <Text style={styles.textStyle}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
  },
  modalView: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingLg,
    marginHorizontal: theme.marginX * 2,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingSm,
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: theme.marginY * 2,
  },
});
