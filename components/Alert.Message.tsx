import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons, TextHolder } from './Themed';
import { theme } from '../constants/Theme';
import Colors from '../constants/Colors';
import { ReactNode, useContext } from 'react';
import { ThemeContext } from '../Theme.Provider';

export function AlertMessage({ children }: { children: ReactNode }) {
  const { appTheme } = useContext(ThemeContext);

  return (
    <TextHolder
      style={[
        styles.container,
        {
          backgroundColor:
            appTheme === 'light'
              ? Colors.light.alertBackground
              : Colors.dark.alertBackground,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="lightbulb-on"
        size={25}
        color={
          appTheme === 'light' ? Colors.light.alertIcon : Colors.dark.alertIcon
        }
      />
      <View style={styles.childrenContainer}>{children}</View>
    </TextHolder>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingMd,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.paddingSm,
  },
  warningText: {
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: theme.marginX,
  },
  childrenContainer: { flex: 1 },
});
