import { Action } from "@ngrx/store";

export const TRY_SIGNUP = "TRY_SIGNUP";
export const SIGNUP = "SIGNUP";
export const TRY_SIGNIN = "TRY_SIGNIN";
export const SIGNIN = "SIGNIN";
export const LOGOUT = "LOGOUT";
export const SET_TOKEN = "SET_TOKEN";
export const CONFIRM_USER = "confirm_user";
export const RESET_PASSWORD_REQUEST = "reset_password_request";
export const RESET_PASSWORD = "reset_password";
export const VALIDATE_TOKEN = "validate_token";
export const SET_CURRENT_USER = "set_current_user";
export const CONFIRM_LOADING = "confirm_loading";
export const UPDATE_MESSAGE = "update_message";
export const KILL_MESSAGE = "mkill_message";

export class TrySignup implements Action {
  readonly type = TRY_SIGNUP;

  constructor(
    public payload: {
      name: string;
      email: string;
      password: string;
      password2: string;
    }
  ) {}
}

export class TrySignin implements Action {
  readonly type = TRY_SIGNIN;

  constructor(public payload: { email: string; password: string }) {}
}

export class Signup implements Action {
  readonly type = SIGNUP;
}

export class Signin implements Action {
  readonly type = SIGNIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class SetToken implements Action {
  readonly type = SET_TOKEN;

  constructor(public payload: string) {}
}

export class ConfirmUser implements Action {
  readonly type = CONFIRM_USER;

  constructor(public payload: string) {}
}

export class ResetPasswordRequest implements Action {
  readonly type = RESET_PASSWORD_REQUEST;

  constructor(public payload: { email: string }) {}
}

export class ResetPassword implements Action {
  readonly type = RESET_PASSWORD;

  constructor(
    public payload: { password: string; password2: string; token: string }
  ) {}
}

export class ValidateToken implements Action {
  readonly type = VALIDATE_TOKEN;

  constructor(public payload: string) {}
}

export class SetCurrentUser implements Action {
  readonly type = SET_CURRENT_USER;

  constructor(public payload: any) {}
}

export class ConfirmLoading implements Action {
  readonly type = CONFIRM_LOADING;
}

export class UpdateMessage implements Action {
  readonly type = UPDATE_MESSAGE;

  constructor(public payload: string) {}
}

export class KillMessage implements Action {
  readonly type = KILL_MESSAGE;
}

export type AuthActions =
  | Signup
  | Signin
  | Logout
  | SetToken
  | TrySignup
  | TrySignin
  | ConfirmUser
  | ResetPasswordRequest
  | ResetPassword
  | ValidateToken
  | SetCurrentUser
  | ConfirmLoading
  | UpdateMessage
  | KillMessage;
