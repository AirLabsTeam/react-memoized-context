import { UsersTeamContextValue, UserTeamContextActions } from './usersTeamContextTypes';

export const usersTeamContextDispatch = (state: UsersTeamContextValue, action: UserTeamContextActions) => {
  console.log('usersTeamContextDispatch', action);
  switch (action.type) {
    case 'assignScore':
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.id === action.data?.userId) {
            return {
              ...user,
              score: action.data?.score ?? 0,
            };
          }
          return user;
        }),
      };
    case 'addUser':
      return {
        ...state,
        users: action.data ? [...state.users, action.data.user] : state.users,
      };
  }
};
