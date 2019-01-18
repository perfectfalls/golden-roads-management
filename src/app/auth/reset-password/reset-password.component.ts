import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../reducers/app.reducer";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgForm } from "@angular/forms";
import isEmpty from "../../utils/is-empty";
import { ResetPassword } from "../../actions/auth.actions";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  errors: any;
  token: string;
  isLoading = false;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.store.pipe(select("errors")).subscribe(err => {
      this.errors = err;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("token")) {
        this.token = paramMap.get("token");
      }
    });
  }

  onSubmit(form: NgForm) {
    if (!isEmpty(this.token)) {
      const data = {
        password: form.value.password,
        password2: form.value.password2,
        token: this.token
      };
      this.store.dispatch(new ResetPassword(data));
    } else {
      console.log("something's wrong with the token param!");
    }
    form.reset();
  }
}
