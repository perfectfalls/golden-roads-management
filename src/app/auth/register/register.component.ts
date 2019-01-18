import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../reducers/app.reducer";
import { Router } from "@angular/router";
import { TrySignup } from "../../actions/auth.actions";
import { AuthState } from "../../reducers/auth.reducer";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  errors = {};
  isLoading = false;

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit() {
    this.store.pipe(select("errors")).subscribe(err => {
      this.isLoading = false;
      this.errors = err;
    });
    this.store.pipe(select("auth")).subscribe((data: AuthState) => {
      if (data.isAuthenticated) {
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  onSignup(form: NgForm) {
    this.isLoading = true;
    const authData = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password2: form.value.password2
    };
    this.store.dispatch(new TrySignup(authData));
    form.reset();
  }
}
