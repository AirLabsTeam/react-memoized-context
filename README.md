<h1 align="center">React Memoized Context</h1>
<p align="center"><i>React Context with Redux-like performance and patterns without installing Redux.</i></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@air/react-memoized-context">
    <img src="https://img.shields.io/npm/v/@air/react-memoized-context?color=2E77FF" alt="size" />
  </a>
  <img alt="size" src="https://img.shields.io/bundlephobia/min/@air/react-memoized-context" />
</p>

## ✨ Features <a name="features"></a>

- Use your React Context without the additional re-renders in the consumers
- Ability to read values out of context "on-the-fly" - useful in callbacks so you don't have to bind the UI to a context value change just to use the value in a callback
- Redux-like pattern (reducer, actions, and selectors)
- Built with TypeScript

## About
Here at [Air](https://air.inc), we needed a way to store _multiple_ instances of complex global state (what React Context API does) but with the performance of Redux. `react-memoized-context` solves this problem.

### Why not React Context?
A React Context provider renders _all_ consumers every time it's `value` changes - even if the component isn't using a property on the `value` (if it's an object). This can cause lots of performance issues and the community is [trying](https://github.com/reactjs/rfcs/pull/119) to [solve it](https://github.com/dai-shi/use-context-selector). We've looked at these other solutions but they're either not ready, had too many bugs or lacked features (like reading values on the fly) so we decided to roll our own.

### Why not Redux?
Redux is great as a global store when multiple components want to read and write to a _single_ centralized value. But when you want to have _multiple_ global values with the same structure, Redux isn't as flexible because you need to duplicate your reducers, actions, and selectors. That's where React Context is nice because you can just wrap around another Provider.

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

3. Create your dispatch method. It should work as redux dispatch - takes an action, modifies state value and returns a new state:
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
      const addUser = useCallback((user: User) => contextValue.dispatch({ type: 'addUser', data: { user } }), [contextValue]);
    
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
   
    usage in component:
    ```typescript
    const context = useUsersTeamContext();
    // pass context to useMemoizedContextSelector
    const users = useMemoizedContextSelector(context, usersTeamUsersSelector);
    ```
   
    to simplify it, you can create a helper:
    ```typescript
    export function useUsersTeamContextSelector<T>(selector: (st: UsersTeamContextValue) => T) {
      const context = useUsersTeamContext();
      return useMemoizedContextSelector(context, selector);
    }
    
    ```
    then, to retrieve `users` from context you can do:

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

    You can read context values on the fly if you need. For example, we will create a user with `users.length` as id. We can use `usersTeamUsersSelector`, but the component would be rerendered every time when any user changes. We don't want that - we need just `users` length. We could create a selector that gets users length, but again - everytime we add a user, the component will rerender. For us, it's enough to know users length by the time we create a user:
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
