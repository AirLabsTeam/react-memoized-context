import { useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable @typescript-eslint/no-empty-function */
const noop = () => {};

export type MemoizedContextListener<T> = (state: T) => void;
export type MemoizedContextDispatch<T> = (state: T, action: MemoizedContextAction) => T;

export interface MemoizedContextValue<T> {
  getValue: () => T;
}

export interface MemoizedContextAction {
  type: any;
  data?: any;
}

export interface MemoizedContextType<T> extends MemoizedContextValue<T> {
  dispatch: (action: MemoizedContextAction) => void;
  addListener: (listener: MemoizedContextListener<T>) => { unsubscribe: () => void };
}

export const defaultMemoizedContextValue: Pick<MemoizedContextType<any>, 'dispatch' | 'addListener'> = {
  dispatch: noop,
  addListener: () => ({ unsubscribe: noop }),
};

export function useMemoizedContextProvider<T>(value: T, getNewState: MemoizedContextDispatch<T>) {
  const contextVal = useRef(value);

  const listeners = useRef<MemoizedContextListener<T>[]>([]);

  const addListener = useCallback((listener: MemoizedContextListener<T>) => {
    listeners.current.push(listener);

    return {
      unsubscribe: () => {
        const index = listeners.current.indexOf(listener);
        listeners.current.splice(index, 1);
      },
    };
  }, []);

  const dispatch = useCallback(
    (action: MemoizedContextAction) => {
      contextVal.current = getNewState(contextVal.current, action);
      ReactDOM.unstable_batchedUpdates(() => {
        listeners.current.forEach((l) => l(contextVal.current));
      });
    },
    [getNewState],
  );

  const getValue = useCallback(() => contextVal.current, []);

  const contextValue = useMemo(
    () => ({
      getValue,
      dispatch,
      addListener,
    }),
    [getValue, addListener, dispatch],
  );

  return {
    contextValue,
  };
}
