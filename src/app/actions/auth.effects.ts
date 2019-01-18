import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { map, switchMap, tap, mergeMap, catchError } from "rxjs/operators";
import { from, of } from "rxjs";

import * as AuthActions from "./auth.actions";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";

import { AppState } from "../reducers/app.reducer";
import { GetErrors } from "./errors.actions";
import jwtdecode from "jwt-decode";

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.ofType(AuthActions.TRY_SIGNUP).pipe(
    map((action: AuthActions.TrySignup) => {
      return action.payload;
    }),
    switchMap(
      (authData: {
        name: string;
        email: string;
        password: string;
        password2: string;
      }) => {
        return this.http.post("/api/users/register", authData).pipe(
          catchError(errors => {
            console.log(errors);
            return of(new GetErrors(errors));
          })
        );
      }
    ),
    mergeMap((data: { success: boolean; token: string }) => {
      localStorage.setItem("jwtToken", data.token);
      const decoded = jwtdecode(data.token);
      this.router.navigate(["/"]);
      return [
        {
          type: AuthActions.SIGNUP
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: data.token
        },
        { type: AuthActions.SET_CURRENT_USER, payload: decoded }
      ];
    })
  );

  @Effect()
  authSignin = this.actions$.ofType(AuthActions.TRY_SIGNIN).pipe(
    map((action: AuthActions.TrySignup) => {
      return action.payload;
    }),
    switchMap((authData: { email: string; password: string }) => {
      return this.http.post("/api/users/login", authData).pipe(
        catchError(errors => {
          console.log(errors.error);
          this.store.dispatch(new GetErrors(errors.error));
          return of([]);
        })
      );
    }),
    mergeMap((data: { success: boolean; token: string }) => {
      localStorage.setItem("jwtToken", data.token);
      const decoded = jwtdecode(data.token);
      this.router.navigate(["/"]);
      return [
        {
          type: AuthActions.SIGNIN
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: data.token
        },
        { type: AuthActions.SET_CURRENT_USER, payload: decoded }
      ];
    })
  );

  @Effect()
  authLogout = this.actions$.ofType(AuthActions.LOGOUT).pipe(
    tap(() => {
      localStorage.removeItem("jwtToken");
      this.router.navigate(["/"]);
      this.store.dispatch(new AuthActions.SetCurrentUser({}));
    })
  );

  @Effect()
  confirmUser = this.actions$.ofType(AuthActions.CONFIRM_USER).pipe(
    map((action: AuthActions.ConfirmUser) => {
      return action.payload;
    }),
    tap(res => this.store.dispatch(new AuthActions.ConfirmLoading())),
    switchMap(token => {
      return this.http.post("/api/users/confirmation", { token }).pipe(
        catchError(errors => {
          console.log(errors);
          return of(new GetErrors(errors));
        })
      );
    }),
    mergeMap((data: { success: boolean; token: string }) => {
      localStorage.setItem("jwtToken", data.token);
      const decoded = jwtdecode(data.token);
      return [
        {
          type: AuthActions.SET_TOKEN,
          payload: data.token
        },
        { type: AuthActions.SET_CURRENT_USER, payload: decoded }
      ];
    })
  );

  @Effect()
  resetPasswordRequest = this.actions$.pipe(
    ofType(AuthActions.RESET_PASSWORD_REQUEST),
    map((action: AuthActions.ResetPasswordRequest) => {
      return action.payload;
    }),
    switchMap((data: { email: string }) => {
      return this.http.post("/api/users/reset_password_request", data).pipe(
        catchError(errors => {
          console.log(errors);
          return of(new GetErrors(errors));
        })
      );
    }),
    tap((res: { success: string }) => {
      this.store.dispatch(new AuthActions.UpdateMessage(res.success));
    })
  );

  @Effect()
  resetPassword = this.actions$.pipe(
    ofType(AuthActions.RESET_PASSWORD),
    map((action: AuthActions.ResetPassword) => {
      return action.payload;
    }),
    switchMap(
      (data: { password: string; password2: string; token: string }) => {
        return this.http.post("/api/users/reset_password", data).pipe(
          catchError(errors => {
            console.log(errors);
            return of(new GetErrors(errors));
          })
        );
      }
    ),
    tap((res: { success: string }) => {
      this.store.dispatch(new AuthActions.UpdateMessage(res.success));
    })
  );

  @Effect()
  validateToken = this.actions$.pipe(
    ofType(AuthActions.VALIDATE_TOKEN),
    map((action: AuthActions.ValidateToken) => {
      return action.payload;
    }),
    switchMap((token: string) => {
      return this.http.post("/api/users/validate_token", { token }).pipe(
        catchError(errors => {
          console.log(errors);
          return of(new GetErrors(errors));
        })
      );
    }),
    tap((res: { validated: string }) => {
      this.store.dispatch(new AuthActions.UpdateMessage(res.validated));
    })
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
