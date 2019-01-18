import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../reducers/app.reducer";
import { AuthState } from "../../reducers/auth.reducer";
import { ConfirmUser } from "../../actions/auth.actions";
import { ActivatedRoute, ParamMap } from "@angular/router";
import isEmpty from "../../utils/is-empty";

@Component({
  selector: "app-confirmation-page",
  templateUrl: "./confirmation-page.component.html",
  styleUrls: ["./confirmation-page.component.css"]
})
export class ConfirmationPageComponent implements OnInit {
  isLoading = false;
  errors: any;
  user: any;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.pipe(select("auth")).subscribe((data: AuthState) => {
      this.isLoading = data.loading;
      this.user = data.user;
    });
    this.store.pipe(select("errors")).subscribe(err => {
      this.errors = err;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("token")) {
        this.store.dispatch(new ConfirmUser(paramMap.get("token")));
      }
    });
  }
}
