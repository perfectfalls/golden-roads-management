import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Store, select } from "@ngrx/store";
import { AppState } from "../reducers/app.reducer";
import { NgForm } from "@angular/forms";
import isEmpty from "../utils/is-empty";
import { TrySendContact } from "../actions/contact.actions";

@Component({
  selector: "app-contact-dialog",
  templateUrl: "./contact-dialog.component.html",
  styleUrls: ["./contact-dialog.component.css"]
})
export class ContactDialogComponent implements OnInit {
  errors: any;
  successMessage: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<ContactDialogComponent>
  ) {}

  ngOnInit() {
    this.store.pipe(select("contact")).subscribe(res => {
      this.successMessage = res.success;
    });
    this.store.pipe(select("errors")).subscribe(err => {
      this.errors = err;
    });
  }

  onMessageSent(form: NgForm) {
    if (!isEmpty(this.errors)) this.errors = null;
    if (!isEmpty(this.successMessage)) this.successMessage = null;
    const mess = {
      name: form.value.name,
      email: form.value.email,
      message: form.value.message
    };
    this.store.dispatch(new TrySendContact(mess));
    form.reset();
  }
}
