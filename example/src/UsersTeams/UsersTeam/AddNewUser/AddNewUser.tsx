import React, { memo } from 'react';

export const AddNewUser = memo(() => {
  const [userName, setUserName] = React.useState('');

  const addNewUser = () => {
    console.log(`Add new user ${userName}`);
    setUserName('');
  };

  return (
    <div>
      <input onChange={(event) => setUserName(event.target.value)} value={userName} />
      <button onClick={addNewUser}>Add member</button>
    </div>
  );
});

AddNewUser.displayName = 'AddNewUser';
