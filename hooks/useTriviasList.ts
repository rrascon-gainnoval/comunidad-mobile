import { useEffect, useState } from 'react';

import { Trivia } from '../types';
import { backend } from '../constants/Backend';

import { useIsFocused } from '@react-navigation/native';
import { useAppContext } from '../App.Provider';

export function useTriviasList() {
  const isFocused = useIsFocused();
  const appContext = useAppContext();
  let mounted = true;

  const [list, setList] = useState<Trivia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wasFetchError, setWasFetchError] = useState(false);

  const fetchTrivias = async () => {
    setIsLoading(true);
    await backend
      .get('api/trivias/', {
        headers: {
          Authorization: `Bearer ${appContext.user.token.access}`,
        },
      })
      .then((response) => {
        setWasFetchError(false);
        if (!mounted) {
          return;
        }

        let trivias = response.data;
        setList([...trivias]);
      })
      .catch(() => {
        if (mounted) {
          setIsLoading(false);
          setWasFetchError(true);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchTrivias();
    return () => {
      mounted = false;
    };
  }, [isFocused]);

  return {
    list,
    isLoading,
    wasFetchError,
    fetchTrivias,
  };
}
