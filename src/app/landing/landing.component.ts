import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../reducers/app.reducer";
import { NgForm } from "@angular/forms";
import { TrySendContact } from "../actions/contact.actions";
import { MatDialog } from "@angular/material";
import { ContactDialogComponent } from "../contact-dialog/contact-dialog.component";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {
  errors: any;
  contact: any;

  constructor(private store: Store<AppState>, public dialog: MatDialog) {}

  ngOnInit() {
    this.store.pipe(select("contact")).subscribe(res => {
      this.contact = res;
    });
    this.store.pipe(select("errors")).subscribe(err => {
      this.errors = err;
    });
  }

  openDialog() {
    this.dialog.open(ContactDialogComponent);
  }

  handleSubmit(contactForm: NgForm) {
    const name = contactForm.value.name;
    const email = contactForm.value.email;
    const message = contactForm.value.message;
    const contactData = { name: name, email: email, message: message };
    this.store.dispatch(new TrySendContact(contactData));
    contactForm.reset();
  }
}
