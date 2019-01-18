import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./reducers/app.reducer";
import { EffectsModule } from "@ngrx/effects";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LandingComponent } from "./landing/landing.component";
import { AboutComponent } from "./about/about.component";
import { FooterComponent } from "./footer/footer.component";
import { RegisterComponent } from "./auth/register/register.component";
import { LoginComponent } from "./auth/login/login.component";
import { ConfirmationPageComponent } from "./auth/confirmation-page/confirmation-page.component";
import { ConfirmEmailMessageComponent } from "./auth/confirm-email-message/confirm-email-message.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppRoutingModule } from "./app-routing.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ServicesComponent } from "./services/services.component";
import {
  MatInputModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatDialogModule
} from "@angular/material";
import { AuthEffects } from "./actions/auth.effects";
import { ContactEffects } from "./actions/contact.effects";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { ContactDialogComponent } from "./contact-dialog/contact-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingComponent,
    AboutComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    ConfirmationPageComponent,
    ConfirmEmailMessageComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DashboardComponent,
    ServicesComponent,
    ContactDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'golden-roads-capital' }),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects, ContactEffects]),
    HttpClientModule,
    BrowserAnimationsModule,
    NgbCollapseModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ContactDialogComponent]
})
export class AppModule {}
