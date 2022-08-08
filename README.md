<h1 align="center">React Memoized Context</h1>
<p align="center"><i>React Context with Redux-like performance and patterns without installing Redux.</i></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@air/react-memoized-context">
    <img src="https://img.shields.io/npm/v/@air/react-memoized-context?color=2E77FF" alt="size" />
  </a>
</p>

## ✨ Features <a name="features"></a>

- Use your React Context without the additional re-renders in the consumers
- Ability to read values out of context "on-the-fly" - useful in callbacks so you don't have to bind the UI to a context value change just to use the value in a callback

## About
React Context is a comfortable tool to use as a React developer because it comes bundled with React. And it uses a familiar pattern that you as a React develop enjoy. The [downsides](https://blog.thoughtspile.tech/2021/10/04/react-context-dangers/) of React Context are known and this was our approach at Air to solve it. We've looked at [other solutions](https://github.com/dai-shi/use-context-selector) but they've had too many issues/lacked features (like reading values on the fly) so we decided to roll our own.

## Install

```bash
npm install --save @air/react-memoized-context
```
```bash
yarn add @air/react-memoized-context
```

## Usage

1. Create types for your context:

   - create type for value, which you want to store:
       ```typescript
       export interface User {
         id: string;
         name: string;
         score: number;
       }
    
       export interface UsersTeamContextValue {
         users: User[];
       }
       ```
   - create type for actions you want to provide to update value:
       ```typescript
       export interface UsersTeamContextActions {
         addUser: (user: User) => void;
         assignScore: (userId: User['id'], score: number) => void;
       }
       ```
   - create type for your context - remember to extend `MemoizedContextType`:
       ```typescript
       export interface UsersTeamContextType extends MemoizedContextType<UsersTeamContextValue>, UsersTeamContextActionsType {}
       ```
   - create default value for your context:
     ```typescript
     export const defaultUsersTeamContextValue: UsersTeamContextType = {
       ...defaultMemoizedContextValue,
       getValue: () => ({
         users: [],
       }),
       addUser: () => {},
       assignScore: () => {},
      };
      ```
   - create types for your actions - you will use them to modify context value:
     ```typescript  
     export interface AddUserAction extends MemoizedContextAction {
       type: 'addUser';
       data?: { user: User };
     }
  
     export interface AssignScoreAction extends MemoizedContextAction {
       type: 'assignScore';
       data?: { userId: User['id']; score: number };
     }
  
     export type UserTeamContextActions = AddUserAction | AssignScoreAction;
     ```
2. Create your context:

    ```typescript
    const UsersTeamContext = createContext<UsersTeamContextType>(defaultUsersTeamContextValue);
    
    const useUsersTeamContext = () => useContext(UsersTeamContext);
    ```

3. Create your dispatch method, which modifies context value:
    ```typescript
    export const usersTeamContextDispatch = (state: UsersTeamContextValue, action: UserTeamContextActions) => {
      switch (action.type) {
        case 'assignScore':
          return {
            ...state,
            users: state.users.map((user) => {
              if (user.id === action.data?.userId) {
                return {
                  ...user,
                  score: action.data?.score ?? 0,
                };
              }
              return user;
            }),
          };
        case 'addUser':
          return {
            ...state,
            users: action.data ? [...state.users, action.data.user] : state.users,
          };
      }
    };
    ```
4. Create your provider:
    ```typescript
    export const UsersTeamProvider = ({ children }: PropsWithChildren<{}>) => {
      
      const { contextValue } = useMemoizedContextProvider<UsersTeamContextValue>(
        // provide default value for your context
        {
          users: [],
        },
        usersTeamContextDispatch,
      );
    
      // create methods you want to expose to clients
      const addUser = useCallback((user: User) => contextValue.dispatch({ type: 'addUser', data: user }), [contextValue]);
    
      const assignScore = useCallback(
        (userId: User['id'], score: number) => contextValue.dispatch({ type: 'assignScore', data: { userId, score } }),
        [contextValue],
      );
    
      // memoize your final value that will be available for clients
      // just return what's in contextValue and add your methods
      const value = useMemo<UsersTeamContextType>(
        () => ({
          ...contextValue,
          addUser,
          assignScore,
        }),
        [addUser, assignScore, contextValue],
      );
    
      return <UsersTeamContext.Provider value={value}>{children}</UsersTeamContext.Provider>;
    };
    ```
   
5. To retrieve data from context, you need selectors:
    ```typescript
    export const usersTeamUsersSelector = (state: UsersTeamContextValue) => state.users;
    ```
   
    you can use it in your component:
    ```typescript
    const context = useUsersTeamContext();
    // pass context to useMemoizedContextSelector
    const users = useMemoizedContextSelector(context, usersTeamUsersSelector);
    ```
   
    to simplify usage, you can create a helper:
    ```typescript
    export function useUsersTeamContextSelector<T>(selector: (st: UsersTeamContextValue) => T) {
      const context = useUsersTeamContext();
      return useMemoizedContextSelector(context, selector);
    }
    
    ```
    then, to retrieve `users` from context you can do in your component:

    ```typescript
    const users = useUsersTeamContextSelector(usersTeamUsersSelector);
    ```

6. Start using your context!

    Wrap your components with your `Provider` component, as you do with React Context:

    ```react
    <UsersTeamProvider>
        <UsersTeam name="Team 1" />
    </UsersTeamProvider>
    ```
   
    To modify context value, use any of your actions:

    ```typescript
    import { useUsersTeamContextSelector } from "./usersTeamContext";
    
    const { addUser } = useUsersTeamContext()
    
    const onClick = () => {
      addUser({ name: 'John' })
    }
    
    ```

    You can read context values on the fly if you need. For example, we will create a user with users.length as id. We can use `usersTeamUsersSelector`, but the component would be rerendered every time when any user changes. We don't want that - we need just user's length. One option is to create a selector that gets users length, but again - everytime we add a user, the component will rerender, and all we need is to know users length by the time we create a user:
    ```typescript
     // get whole context value - it will not cause any rerender!
     const contextValue = useUsersTeamContext();
    
      const addNewUser = () => {
        // read users array when we need it
        const users = contextValue.getValue().users;
        // call addUser action to add a new user
        contextValue.addUser({ id: users.length + 1, name: userName, score: 0 });
      };
    ```
