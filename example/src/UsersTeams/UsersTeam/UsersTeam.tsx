import React, { memo } from 'react';
import './UsersTeam.css';
import { AddNewUser } from './AddNewUser/AddNewUser';
import { usersTeamUsersSelector } from '../../UsersTeamContext/userTeamSelectors';
import { useUsersTeamContextSelector } from '../../UsersTeamContext/usersTeamContext';
import { UserItem } from './UserItem';

interface UsersTeamProps {
  name: string;
}

export const UsersTeam = memo(({ name }: UsersTeamProps) => {
  const users = useUsersTeamContextSelector(usersTeamUsersSelector);

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
    </div>
  );
});

UsersTeam.displayName = 'UsersTeam';
