import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../reducers/app.reducer";
import { NgForm } from "@angular/forms";
import { ResetPasswordRequest } from "../../actions/auth.actions";
import { AuthState } from "../../reducers/auth.reducer";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  errors = {};
  resetMessage = null;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(select("errors")).subscribe(err => {
      this.errors = err;
    });
    this.store.pipe(select("auth")).subscribe((data: AuthState) => {
      this.resetMessage = data.resetMessage;
    });
  }

  resetPassReq(form: NgForm) {
    this.store.dispatch(new ResetPasswordRequest(form.value.email));
  }
}
