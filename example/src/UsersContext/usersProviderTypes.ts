import { defaultMemoizedContextValue, MemoizedContextType } from '../../../src/hooks/useMemoizedContextProvider';

export interface User {
  id: string;
  name: string;
  score: number;
}

export interface UsersTeamContextValue {
  users: User[];
}

export interface UsersTeamContextActionsType {
  addUser: (user: User) => void;
  assignScore: (userId: User['id'], score: number) => void;
}

export interface UsersTeamContextType extends MemoizedContextType<UsersTeamContextValue>, UsersTeamContextActionsType {}

export const defaultUsersTeamContextValue: UsersTeamContextType = {
  ...defaultMemoizedContextValue,
  getValue: () => ({
    users: [],
  }),
  addUser: () => {},
  assignScore: () => {},
};

export type UserTeamContextActions = 'addUser' | 'assignScore';
