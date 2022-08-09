import { defaultMemoizedContextValue, MemoizedContextAction, MemoizedContextType } from '@air/react-memoized-context';

export interface User {
  id: number;
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

export interface AddUserAction extends MemoizedContextAction {
  type: 'addUser';
  data?: { user: User };
}

export interface AssignScoreAction extends MemoizedContextAction {
  type: 'assignScore';
  data?: { userId: User['id']; score: number };
}

export type UserTeamContextActions = AddUserAction | AssignScoreAction;
