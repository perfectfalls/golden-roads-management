import { Injectable, Optional, Inject } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { HttpClient } from "@angular/common/http";
import { map, switchMap, catchError, tap } from "rxjs/operators";
import {
  TrySendContact,
  TRY_SEND_CONTACT,
  SendContact,
  SEND_CONTACT
} from "./contact.actions";
import { of } from "rxjs";
import { GetErrors, ClearErrors } from "./errors.actions";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers/app.reducer";
import { APP_BASE_HREF } from "@angular/common";

@Injectable()
export class ContactEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>,
    @Optional()
    @Inject(APP_BASE_HREF)
    origin: string
  ) {}

  @Effect()
  sendContact = this.actions$.pipe(
    ofType(TRY_SEND_CONTACT),
    map((action: TrySendContact) => {
      return action.payload;
    }),
    tap(res => this.store.dispatch(new ClearErrors())),
    switchMap((data: { name: string; email: string; message: string }) => {
      console.log(data);
      return this.http.post("/api/contact", data).pipe(
        catchError(errors => {
          console.log(errors);
          return of(new GetErrors(errors.error));
        })
      );
    }),
    map((res: { success: string }) => {
      console.log(res);
      return { type: SEND_CONTACT, payload: res };
    })
  );
}
