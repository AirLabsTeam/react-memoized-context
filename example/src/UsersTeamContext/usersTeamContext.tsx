import { createContext, PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import {
  defaultUsersTeamContextValue,
  User,
  UsersTeamContextType,
  UsersTeamContextValue,
} from './usersTeamContextTypes';
import { useMemoizedContextProvider, useMemoizedContextSelector } from '@air/react-memoized-context';
import { usersTeamContextDispatch } from './usersTeamContextDispatch';

const UsersTeamContext = createContext<UsersTeamContextType>(defaultUsersTeamContextValue);

export const useUsersTeamContext = () => useContext(UsersTeamContext);

export const UsersTeamProvider = ({ children }: PropsWithChildren<{}>) => {
  // provide default value for your context
  const { contextValue } = useMemoizedContextProvider<UsersTeamContextValue>(
    {
      users: [],
    },
    usersTeamContextDispatch,
  );

  const addUser = useCallback((user: User) => contextValue.dispatch({ type: 'addUser', data: user }), [contextValue]);

  const assignScore = useCallback(
    (userId: User['id'], score: number) => contextValue.dispatch({ type: 'assignScore', data: { userId, score } }),
    [contextValue],
  );

  const value = useMemo<UsersTeamContextType>(
    () => ({
      ...contextValue,
      addUser,
      assignScore,
    }),
    [addUser, assignScore, contextValue],
  );

  return <UsersTeamContext.Provider value={value}>{children}</UsersTeamContext.Provider>;
};

export function useUsersTeamContextSelector<T>(selector: (st: UsersTeamContextValue) => T) {
  const context = useUsersTeamContext();
  return useMemoizedContextSelector(context, selector);
}
