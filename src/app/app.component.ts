import { Component, OnInit, PLATFORM_ID, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "./reducers/app.reducer";
import { SetToken, SetCurrentUser } from "./actions/auth.actions";
import jwtdecode from "jwt-decode";
import isEmpty from "./utils/is-empty";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";

  constructor(
    private store: Store<AppState>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("jwtToken");
      if (token !== "undefined" && !isEmpty(token)) {
        this.store.dispatch(new SetToken(localStorage.getItem("jwtToken")));
        const decoded = jwtdecode(localStorage.getItem("jwtToken"));
        this.store.dispatch(new SetCurrentUser(decoded));

        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("jwtToken");
          this.store.dispatch(new SetToken(null));
          this.store.dispatch(new SetCurrentUser({}));
        }
      }
    }
  }
}
