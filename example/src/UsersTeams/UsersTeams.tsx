import React from 'react';
import { UsersTeam } from './UsersTeam/UsersTeam';

export const UsersTeams = () => {
  return (
    <div style={{ display: 'flex', padding: 16 }}>
      <UsersTeam name="Team 1" />
      <UsersTeam name="Team 2" />
    </div>
  );
};
