import { useCallback, useState, useEffect } from 'react';
import isEqual from 'react-fast-compare';
import { MemoizedContextListener, MemoizedContextType } from './useMemoizedContextProvider';

export function useMemoizedContextSelector<T, V>(contextValue: MemoizedContextType<T>, selector: (st: T) => V) {
  const { addListener, getValue } = contextValue;

  const [state, setState] = useState(selector(getValue()));

  const listener: MemoizedContextListener<T> = useCallback(
    (updatedState: T) => {
      const newState = selector(updatedState);

      setState((oldState: V) => {
        if (!isEqual(newState, oldState)) {
          return newState;
        }
        return oldState;
      });
    },
    [selector],
  );

  useEffect(() => {
    const subscription = addListener(listener);

    return () => {
      subscription.unsubscribe();
    };
  }, [addListener, listener, contextValue, selector]);

  return state;
}
