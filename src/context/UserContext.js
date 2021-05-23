import React, { createContext, useState } from 'react';
import { handleGetDisplayName } from '../lib/firebase';

export const UserContext = createContext({});

export function UserProvider(props) {
  const [authUser, setAuthUser] = useState();
  return (
    <UserContext.Provider value={{ authUser, setAuthUser }}>
      {props.children}
    </UserContext.Provider>
  )
}