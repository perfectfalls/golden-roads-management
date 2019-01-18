import { Component, OnInit, ElementRef, HostListener } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "../reducers/app.reducer";
import { Logout } from "../actions/auth.actions";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { MatDialog } from "@angular/material";
import { ContactDialogComponent } from "../contact-dialog/contact-dialog.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
  animations: [
    trigger("scrollAnimation", [
      state(
        "transparent",
        style({
          backgroundColor: "rgba(255,255,255,0.1)",
          transform: "scaleY(1)"
        })
      ),
      state(
        "opaque",
        style({
          backgroundColor: "#1C2833",
          transform: "scaleY(0.9)",
          transformOrigin: "top",
          color: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
        })
      ),
      transition("transparent <=> opaque", animate("500ms ease"))
    ])
  ]
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  user = {};
  state = "transparent";
  blacken = false;
  isCollapsed = true;

  constructor(
    private store: Store<AppState>,
    public el: ElementRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.pipe(select("auth")).subscribe(data => {
      if (data.isAuthenticated) {
        this.isAuthenticated = data.isAuthenticated;
        this.user = data.user;
      }
    });
  }

  openDialog() {
    this.dialog.open(ContactDialogComponent);
  }

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop;
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > componentPosition) {
      this.state = "opaque";
      this.blacken = true;
    } else {
      this.state = "transparent";
      this.blacken = false;
    }
  }

  onLogoutClick() {
    this.store.dispatch(new Logout());
  }
}
//[@scrollAnimation]="state"
