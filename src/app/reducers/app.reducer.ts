import { ActionReducerMap } from "@ngrx/store";

import * as fromAuth from "./auth.reducer";
import { errorsReducer } from "./error.reducer";
import { contactReducer } from "./contact.reducer";

export interface AppState {
  auth: fromAuth.AuthState;
  errors: any;
  contact: any;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  errors: errorsReducer,
  contact: contactReducer
};
