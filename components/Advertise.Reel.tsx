import { FlatList, View } from 'react-native';
import { AdvertiseCard } from '../components/Advertise.Card';

import { AdvertiseReelProps } from '../types';

import * as Layout from '../constants/Layout';

const layout = Layout.default;
const width = layout.window.width;
const isSmallDevice = layout.isSmallDevice;

import moment from 'moment';
import 'moment/locale/es';

export const AdvertiseReel = (props: AdvertiseReelProps) => {
  return (
    <View>
      <FlatList
        style={{ height: 200 }}
        horizontal={true}
        disableIntervalMomentum={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - (isSmallDevice ? 55 : 100)}
        data={props.advertises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AdvertiseCard
            image={item.image}
            colorSet={item.colorSet}
            title={item.title}
            description={item.body}
            link={item.url}
            terms={
              item.type === 'promo'
                ? `Esta promoción es válida solo del ${moment(item.start_date)
                    .locale('es-mx')
                    .format('LL')} al ${moment(item.end_date)
                    .locale('es-mx')
                    .format('LL')}`
                : null
            }
          />
        )}
      />
    </View>
  );
};
