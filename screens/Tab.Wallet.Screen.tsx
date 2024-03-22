import React, { useCallback, useContext, useEffect, useState } from 'react';

import { StyleSheet, Pressable } from 'react-native';

import moment from 'moment';
import 'moment/locale/es';

import 'intl';
import 'intl/locale-data/jsonp/es-MX';

import { View, Container, ScrollView, Text } from '../components/Themed';
import { HeaderText, TitleText } from '../components/StyledText';

import Colors, { primaryColor } from '../constants/Colors';

import { useAppContext } from '../App.Provider';
import { altatecaWeb, backend } from '../constants/Backend';
import { theme } from '../constants/Theme';
import { DropdownView } from '../components/DropDown.View';
import { Loader } from '../components/Loader';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { ThemeContext } from '../Theme.Provider';
import { AlertMessage } from '../components/Alert.Message';
import axios from 'axios';
import { CreditCard } from '../components/Credit.Card';

type Balance = {
  debt: number;
  limit: number;
};

type Transaction = {
  date: string;
  purchases: Array<{ title: string; ammount: number; quantity: number }>;
};

type TransactionsByWeek = Array<{ title: string; transactions: Transaction[] }>;

const defaultBalance = {
  debt: 0,
  limit: 0,
};

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});
export function TabWalletScreen({ navigation }: { navigation: any }) {
  const appContext = useAppContext();
  const isFocused = useIsFocused();
  const { appTheme } = useContext(ThemeContext);

  const [balance, setBalance] = useState<Balance>(defaultBalance);
  const [transactionsByWeek, setTransactionsByWeek] =
    useState<TransactionsByWeek>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unactive, setUnactive] = useState<boolean>(false);

  let mounted = true;

  const fetchStatus = async () => {
    setIsLoading(true);

    try {
      const res = await altatecaWeb.get(
        `clickbalance_api/consultarCreditoActivo?codigo_empleado=${appContext.user.id}&id_campo=${appContext.user.locationId}`
      );

      setBalance({
        ...balance,
        debt: res.data.debe,
        limit: res.data.limite_credito,
      });

      await fetchTransactions();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          return;
        }
        if (error.response.status === 404) {
          setUnactive(true);
        }
      }
    }
    setIsLoading(false);
  };

  const fetchTransactions = async () => {
    try {
      const res = await backend.post(
        '/users/get_detalle/',
        {
          id_empleado: appContext.user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${appContext.user.token.access}`,
          },
        }
      );
      if (res.data && mounted) {
        setTransactionsByWeek([...res.data]);
      }
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      fetchStatus();
      return () => {
        mounted = false;
      };
    }, [isFocused])
  );

  return (
    <ScrollView stickyHeaderIndices={[2]} style={styles.container}>
      <HeaderText>¡Disfruta de tu crédito!</HeaderText>
      {isLoading && <Loader size="large" />}

      <CreditCard
        holdersName={appContext.user.name + ' ' + appContext.user.lastname}
      />

      {unactive && (
        <>
          <TitleText style={[styles.cardMiddle, { textAlign: 'center' }]}>
            Aún no has activato tu crédito
          </TitleText>
          <Pressable
            style={{ marginHorizontal: theme.marginX }}
            onPress={() => navigation.navigate('WalletCreate')}
          >
            <AlertMessage>
              <Text>
                Te invitamos a activar tu crédito desde{' '}
                <Text style={{ color: primaryColor }}>aquí</Text> o desde la
                tienda.
              </Text>
            </AlertMessage>
          </Pressable>
        </>
      )}

      {!isLoading && !unactive && (
        <View
          style={[
            styles.balanceContainer,
            appTheme === 'light' ? styles.bgLight : styles.bgDark,
          ]}
        >
          <TitleText style={styles.fontNormal}>Debes pagar:</TitleText>
          <Container style={styles.cardMiddle}>
            <TitleText style={{ fontSize: 30 }}>
              {formatter.format(balance.debt)}
            </TitleText>
          </Container>
          <TitleText style={styles.fontNormal}>
            Crédito disponible: {formatter.format(balance.limit)}
          </TitleText>
        </View>
      )}

      {!isLoading && !unactive && (
        <View>
          {transactionsByWeek.length > 0 && (
            <View>
              <TitleText style={{ textAlign: 'left', marginVertical: 30 }}>
                últimos movimientos
              </TitleText>

              {transactionsByWeek.map((week, byWeekIndex) => (
                <DropdownView key={byWeekIndex} label={week.title}>
                  {week.transactions.map(
                    (transaction: Transaction, transactionIndex: number) => (
                      <View key={transactionIndex}>
                        <Text style={styles.bold}>
                          {moment(transaction.date)
                            .locale('es-mx')
                            .format('LL')}
                        </Text>
                        {transactionIndex === 0 && (
                          <View
                            style={[
                              styles.rowBetween,
                              { marginTop: theme.marginY * 2 },
                            ]}
                          >
                            <View style={styles.rowStart}>
                              <Text style={styles.bold}>CANT</Text>
                            </View>
                            <View style={styles.rowCenter}>
                              <Text style={styles.bold}>PRODUCTO</Text>
                            </View>
                            <View style={styles.rowEnd}>
                              <Text style={styles.bold}>MONTO</Text>
                            </View>
                          </View>
                        )}
                        {transaction.purchases.map(
                          (purchase, purchaseIndex) => (
                            <View
                              key={purchaseIndex}
                              style={[styles.cardMiddle, styles.rowBetween]}
                            >
                              <View style={styles.rowStart}>
                                <Text
                                  style={[
                                    styles.transactionContent,
                                    { marginLeft: 15 },
                                  ]}
                                >
                                  {`${purchase.quantity}`}
                                </Text>
                              </View>
                              <View style={styles.rowCenter}>
                                <Text style={styles.transactionContent}>
                                  {`${purchase.title
                                    .split(' ')
                                    .slice(0, 3)
                                    .join(' ')}`}
                                </Text>
                              </View>
                              <View style={styles.rowEnd}>
                                <Text>
                                  {formatter.format(purchase.ammount)}
                                </Text>
                              </View>
                            </View>
                          )
                        )}
                        <Container style={styles.spacer} />
                      </View>
                    )
                  )}
                </DropdownView>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceContainer: {
    padding: theme.paddingSm,
    textAlign: 'center',
  },
  fontNormal: {
    fontWeight: 'normal',
  },
  transactionContent: { marginVertical: 10 },
  menuSwitcher: {
    flexDirection: 'row',
    padding: theme.paddingMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    marginHorizontal: theme.marginX,
    padding: theme.paddingSm,
    width: 160,
    alignItems: 'center',
  },
  hide: {
    display: 'none',
  },
  moreMenuCard: {
    width: 140,
    height: 120,
    borderRadius: theme.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    borderWidth: 1,
    opacity: 0.5,
    marginVertical: theme.marginY,
  },
  bgLight: {
    backgroundColor: Colors.light.background,
  },
  bgDark: {
    backgroundColor: Colors.dark.background,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMiddle: {
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  product: {
    marginRight: 'auto',
    marginLeft: theme.marginX,
  },
  rowCenter: { flex: 8 },
  rowStart: { flex: 2 },
  rowEnd: { flex: 2 },
  alert: {
    borderRadius: theme.borderRadius,
    padding: theme.paddingMd,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
});
