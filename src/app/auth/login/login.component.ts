import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../reducers/app.reducer";
import { AuthState } from "../../reducers/auth.reducer";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TrySignin } from "../../actions/auth.actions";
import { Observable, Observer } from "rxjs";
import isEmpty from "../../utils/is-empty";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  errors: any;
  isLoading = false;
  form: FormGroup;
  errorMessage: string;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, { validators: [Validators.required] })
    });
    this.store.pipe(select("errors")).subscribe(err => {
      this.isLoading = false;
      this.errors = err;
      if (this.errors.hasOwnProperty("password"))
        this.errorMessage = this.errors.password;
      else if (this.errors.hasOwnProperty("email"))
        this.errorMessage = this.errors.email;
    });
    this.store.pipe(select("auth")).subscribe((data: AuthState) => {
      if (data.isAuthenticated) {
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  onLogin() {
    if (!isEmpty(this.errorMessage)) this.errorMessage = null;
    if (this.form.invalid) return;
    this.isLoading = true;
    const authData = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.store.dispatch(new TrySignin(authData));
    this.form.reset();
  }
}
