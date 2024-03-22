import React, { useEffect, useContext } from 'react';
import mime from 'mime';

import {
  StyleSheet,
  View as DefaultView,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  Text,
  View,
  MaterialIcons,
  TextHolder,
  Container,
  MaterialCommunityIcons,
  ScrollView,
} from '../components/Themed';
import { TitleText } from '../components/StyledText';
import { UvaCoins } from '../components/Uva.Coins';
import { SecondaryButton } from '../components/Secondary.Button';
import * as ImagePicker from 'expo-image-picker';

import { backend } from '../constants/Backend';
import { theme } from '../constants/Theme';
import { primaryColorOpacity } from '../constants/Colors';
import { useAppContext, AuthContext } from '../App.Provider';

import { AxiosRequestConfig } from 'axios';
import { ThemeContext } from '../Theme.Provider';
import { User } from '../types';
import { Loader } from '../components/Loader';

interface FormDataValue {
  uri: string;
  name: string;
  type: string;
}

interface FormData {
  append(
    name: string,
    value: string | Blob | FormDataValue,
    fileName?: string
  ): void;
  delete(name: string): void;
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
  has(name: string): boolean;
  set(
    name: string,
    value: string | Blob | FormDataValue,
    fileName?: string
  ): void;
}

declare let FormData: {
  prototype: FormData;
  new (form?: HTMLFormElement): FormData;
};

interface FormData {
  entries(): IterableIterator<[string, string | File]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string | File>;
  [Symbol.iterator](): IterableIterator<string | File>;
}

export function ProfileScreen({ navigation }: any) {
  const [user, setUser] = React.useState<User | null>(null);
  const [signingOut, setSigningOut] = React.useState(false);

  let mounted = true;
  const appContext = useAppContext();
  const { primaryColor } = useContext(ThemeContext);

  const level = user ? Math.floor(user.xp / 100) : 0;
  const nextLevel = level + 1;
  const xpForNextLevel = nextLevel * 100;

  const { signOut } = useContext<any>(AuthContext);

  const fetchUserDetails = async () => {
    await backend
      .get(`api/usuarios/${appContext.user.id}/`, {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((response) => {
        if (mounted) {
          setUser(response.data);
        }
      })
      .catch(() => {});
  };

  const handleSignOut = () => {
    setSigningOut(true);
    setTimeout(() => {
      signOut();
    }, 1100);
  };

  const uploadImage = async (image: any) => {
    const data = new FormData();

    const imageUri = 'file:///' + image.uri.split('file:/').join('');
    const imageName = imageUri.split('/').pop();
    const iageType = mime.getType(imageUri);

    data.append('foto', {
      uri: imageUri,
      name: imageName ? imageName : 'image.jpg',
      type: iageType ? iageType : image.type,
    });

    data.append('id_empleado', appContext.user.id);

    const config: AxiosRequestConfig = {
      method: 'put',
      url: 'users/user_detail/',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${appContext.user.token.access}`,
      },
      transformRequest: (data, headers) => {
        return data;
      },
      onUploadProgress: (progressEvent) => {},
      data: data,
    };
    await backend
      .request(config)
      .then(() => {
        if (mounted && user) {
          setUser({ ...user, icon: image.uri });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      uploadImage(result);
    }
  };

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserDetails();
    });
    return unsubscribe;
  }, [navigation]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Loader size="large" />

        <SecondaryButton
          containerStyle={{ marginTop: 'auto' }}
          text="CERRAR SESIÓN"
          handlePress={handleSignOut}
          isLoading={signingOut}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DefaultView style={styles.center}>
        {user.icon ? (
          <DefaultView style={styles.profileContainer}>
            <Container
              style={{
                borderRadius: 80,
              }}
            >
              <DefaultView style={styles.img}>
                <Image
                  source={{
                    uri: user.icon,
                  }}
                  style={styles.img}
                />
              </DefaultView>
            </Container>
            <TouchableOpacity style={styles.imgButton} onPress={pickImage}>
              <TextHolder style={styles.iconHolder}>
                <MaterialIcons name="camera-alt" size={35} />
              </TextHolder>
            </TouchableOpacity>
          </DefaultView>
        ) : (
          <DefaultView style={styles.profileContainer}>
            <DefaultView
              style={[styles.img, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.imgText}>
                {appContext.user?.name.charAt(0) +
                  appContext.user?.lastname.charAt(0)}
              </Text>
            </DefaultView>
            <TouchableOpacity style={styles.imgButton} onPress={pickImage}>
              <TextHolder style={styles.iconHolder}>
                <MaterialIcons name="camera-alt" size={35} />
              </TextHolder>
            </TouchableOpacity>
          </DefaultView>
        )}

        <TitleText>
          {appContext.user.name + ' ' + appContext.user.lastname}
        </TitleText>
      </DefaultView>
      <View style={styles.statsContainer}>
        <View style={styles.levelContainer}>
          <TitleText>Nivel {level}</TitleText>
        </View>
        <UvaCoins points={user ? user.coins : 0} />
      </View>
      <Container style={styles.progressContainer}>
        <TextHolder style={styles.progressBg}></TextHolder>
        <View
          style={[
            styles.progress,
            {
              width: 100 - (xpForNextLevel - user.xp) + '%',
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
              borderTopRightRadius:
                user.xp === xpForNextLevel ? 50 : theme.borderRadius,
              borderBottomRightRadius:
                user.xp === xpForNextLevel ? 50 : theme.borderRadius,
            },
          ]}
        />
        <Text style={styles.progressText}>
          {user.xp} / {xpForNextLevel} EXP para nivel {nextLevel}
        </Text>
      </Container>

      {/* menu start */}
      <MenuCard
        containerStyle={{ marginTop: theme.marginY * 2 }}
        onPress={() => {
          navigation.navigate('ChangePass', { source: 'profile' });
        }}
        text="Cambiar contraseña"
      />
      <MenuCard
        onPress={() => {
          navigation.navigate('Achievments');
        }}
        text="Logros"
      />
      <MenuCard
        containerStyle={{ marginBottom: theme.marginY * 2 }}
        onPress={() => {
          navigation.navigate('Preferences');
        }}
        text="Preferencias"
      />

      {/* menu end */}

      <SecondaryButton
        text="CERRAR SESIÓN"
        handlePress={handleSignOut}
        isLoading={signingOut}
      />
    </ScrollView>
  );
}

function MenuCard({
  onPress,
  text,
  containerStyle,
}: {
  onPress: () => void;
  text: string;
  containerStyle?: any;
}) {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <TextHolder style={styles.menuItem}>
        <Text style={{ fontWeight: 'bold' }}>{text}</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} />
      </TextHolder>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    marginTop: 50,
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 150,
    width: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
  imgButton: {
    position: 'relative',
    top: -55,
    right: -60,
  },
  iconHolder: {
    borderRadius: 75,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBg: {
    height: 50,
    borderRadius: 50,
  },
  progressContainer: {
    marginHorizontal: theme.marginX,
    position: 'relative',
    borderRadius: 50,
    overflow: 'hidden',
  },
  progress: {
    height: 50,
    backgroundColor: primaryColorOpacity,
    position: 'absolute',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  progressText: {
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    right: 0,
    left: 0,
    top: '30%',
    fontWeight: 'bold',
  },
  menuItem: {
    padding: theme.paddingMd,
    marginHorizontal: theme.marginX,
    marginTop: theme.marginY,
    borderRadius: theme.borderRadius,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
