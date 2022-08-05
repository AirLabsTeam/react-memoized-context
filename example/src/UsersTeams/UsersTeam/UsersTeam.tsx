import React, { memo } from 'react';
import './UsersTeam.css';
import { AddNewUser } from './AddNewUser/AddNewUser';

interface UsersTeamProps {
  name: string;
}

export const UsersTeam = memo(({ name }: UsersTeamProps) => {
  return (
    <div className="UsersTeamContainer">
      <h3>{name}</h3>
      <div style={{ marginTop: 8 }}>
        <AddNewUser />
      </div>
    </div>
  );
});

UsersTeam.displayName = 'UsersTeam';
