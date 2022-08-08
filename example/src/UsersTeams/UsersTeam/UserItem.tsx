import React, { memo, useEffect, useRef } from 'react';
import { User } from '../../UsersTeamContext/usersTeamContextTypes';
import { useUsersTeamContext } from '../../UsersTeamContext/usersTeamContext';

interface UserProps {
  user: User;
}

export const UserItem = memo(({ user }: UserProps) => {
  const renderTimes = useRef(0);
  const { assignScore } = useUsersTeamContext();

  useEffect(() => {
    renderTimes.current += 1;
  });

  const onClick = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    assignScore(user.id, randomNumber);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <div>
        {user.id} - {user.name} - {user.score} - <span style={{ fontSize: 10 }}>Renders: {renderTimes.current}</span>
      </div>
      <button onClick={onClick}>Set score</button>
    </div>
  );
});

UserItem.displayName = 'User';
