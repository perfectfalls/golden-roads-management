import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../reducers/app.reducer";
import { flatMap, first } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select("auth").pipe(
      first(),
      flatMap(data => {
        const authReq = !!data.token
          ? req.clone({
              setHeaders: { Authorization: "Bearer " + data.token }
            })
          : req;
        return next.handle(authReq);
      })
    );
  }
}
