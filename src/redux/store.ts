import { configureStore } from '@reduxjs/toolkit';
import UserDataReducer  from './reducers/UserData';

export const store = configureStore({
  reducer: {
    userData:UserDataReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch