import React, { memo, useEffect, useRef } from 'react';
import './UsersTeam.css';
import { AddNewUser } from './AddNewUser';
import { usersTeamUsersSelector } from '../../UsersTeamContext/userTeamSelectors';
import { useUsersTeamContextSelector } from '../../UsersTeamContext/usersTeamContext';
import { UserItem } from './UserItem';

interface UsersTeamProps {
  name: string;
}

export const UsersTeam = memo(({ name }: UsersTeamProps) => {
  const renderTimes = useRef(0);
  const users = useUsersTeamContextSelector(usersTeamUsersSelector);

  useEffect(() => {
    renderTimes.current += 1;
  });

  return (
    <div className="UsersTeamContainer">
      <h3>{name}</h3>
      <div>
        {users.map((user) => (
          <UserItem user={user} key={user.id} />
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <AddNewUser />
      </div>
      <div style={{ fontSize: 10 }}>Renders: {renderTimes.current}</div>
    </div>
  );
});

UsersTeam.displayName = 'UsersTeam';
