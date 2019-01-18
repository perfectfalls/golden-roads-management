import * as AuthActions from "../actions/auth.actions";
import isEmpty from "../utils/is-empty";

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  resetRequest: any;
  token: string;
  resetMessage: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  resetRequest: {},
  token: null,
  resetMessage: null
};

export function authReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.SIGNUP:
    case AuthActions.SIGNIN:
      return {
        ...state,
        isAuthenticated: true
      };
    case AuthActions.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        loading: false
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false
      };
    case AuthActions.SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case AuthActions.CONFIRM_LOADING:
      return { ...state, loading: true };
    case AuthActions.UPDATE_MESSAGE:
      return { ...state, resetMessage: action.payload };
    case AuthActions.KILL_MESSAGE:
      return { ...state, resetMessage: null };
    default:
      return state;
  }
}
