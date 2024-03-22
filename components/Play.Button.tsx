import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import React, { useContext } from 'react';
import { MaterialCommunityIcons } from './Themed';
import { ThemeContext } from '../Theme.Provider';

export function PlayButton({ ...props }: TouchableOpacityProps) {
  const { primaryColor } = useContext(ThemeContext);
  return (
    <TouchableOpacity {...props}>
      <MaterialCommunityIcons
        name="play-circle"
        size={35}
        color={primaryColor}
      />
    </TouchableOpacity>
  );
}
