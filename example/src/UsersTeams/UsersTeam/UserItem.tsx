import React, { memo } from 'react';
import { User } from '../../UsersTeamContext/usersTeamContextTypes';

interface UserProps {
  user: User;
}

export const UserItem = memo(({ user }: UserProps) => {
  return (
    <div>
      {user.id} - {user.name} - {user.score}
    </div>
  );
});

UserItem.displayName = 'User';
