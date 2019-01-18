import { Action } from "@ngrx/store";

export const TRY_SEND_CONTACT = "try_send_contact";
export const SEND_CONTACT = "send_contact";

export class TrySendContact implements Action {
  readonly type = TRY_SEND_CONTACT;

  constructor(
    public payload: { name: string; email: string; message: string }
  ) {}
}

export class SendContact implements Action {
  readonly type = SEND_CONTACT;

  constructor(public payload: { success: string }) {}
}

export type ContactActions = TrySendContact | SendContact;
