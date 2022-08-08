import React, { memo } from 'react';
import { useUsersTeamContext } from '../../UsersTeamContext/usersTeamContext';

export const AddNewUser = memo(() => {
  const [userName, setUserName] = React.useState('');

  // this does not cause any rerender
  const contextValue = useUsersTeamContext();

  const addNewUser = () => {
    setUserName('');
    const users = contextValue.getValue().users;
    contextValue.addUser({ id: users.length + 1, name: userName, score: 0 });
  };

  return (
    <div>
      <input onChange={(event) => setUserName(event.target.value)} value={userName} />
      <button onClick={addNewUser}>Add member</button>
    </div>
  );
});

AddNewUser.displayName = 'AddNewUser';
