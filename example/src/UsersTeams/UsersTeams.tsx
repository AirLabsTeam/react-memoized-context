import React from 'react';
import { UsersTeam } from './UsersTeam/UsersTeam';
import { UsersTeamProvider } from '../UsersTeamContext/usersTeamContext';

export const UsersTeams = () => {
  return (
    <div style={{ display: 'flex', padding: 16 }}>
      <UsersTeamProvider>
        <UsersTeam name="Team 1" />
      </UsersTeamProvider>
      <UsersTeamProvider>
        <UsersTeam name="Team 2" />
      </UsersTeamProvider>
    </div>
  );
};
