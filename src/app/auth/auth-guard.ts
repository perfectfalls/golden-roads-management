import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../reducers/app.reducer";
import { AuthState } from "../reducers/auth.reducer";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    let isAuth;
    this.store.pipe(select("auth")).subscribe((data: AuthState) => {
      isAuth = data.isAuthenticated;
    });
    if (!isAuth) {
      this.router.navigate(["./login"]);
    }
    return isAuth;
  }
}
