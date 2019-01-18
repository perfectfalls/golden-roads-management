import { Action } from "@ngrx/store";

export const GET_ERRORS = "get errors";
export const CLEAR_ERRORS = "clear errors";

export class GetErrors implements Action {
  readonly type = GET_ERRORS;

  constructor(public payload: any) {}
}

export class ClearErrors implements Action {
  readonly type = CLEAR_ERRORS;
}

export type ErrorsActions = GetErrors | ClearErrors;
