import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useAppContext } from '../App.Provider';
import { alsApi } from '../constants/Backend';
import { Visit } from '../types';

const initialVisit = {
  medico: {
    citas: [],
    historial: [],
  },
  dental: {
    citas: [],
    historial: [],
  },
  token: '',
};

export function useAlsVisits() {
  const appContext = useAppContext();
  const [visits, setVisits] = useState<Visit>(initialVisit);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchVisits = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await alsApi.get(
        `citas/historial/${appContext.user.id}`
        //"citas/historial/230250"
      );

      setVisits(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [appContext.user.id]);

  useFocusEffect(
    useCallback(() => {
      fetchVisits();
    }, [fetchVisits])
  );

  return { list: visits, isLoading };
}
