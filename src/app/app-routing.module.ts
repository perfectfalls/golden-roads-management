import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth-guard";
import { LandingComponent } from "./landing/landing.component";
import { RegisterComponent } from "./auth/register/register.component";
import { LoginComponent } from "./auth/login/login.component";
import { AboutComponent } from "./about/about.component";
import { ConfirmationPageComponent } from "./auth/confirmation-page/confirmation-page.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./auth/reset-password/reset-password.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ServicesComponent } from "./services/services.component";

const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    data: {
      title: "Golden Roads Capital",
      metatags: {
        description: "Lading page for the golden roads capital website",
        keywords: "golden, roads, capital, bitcoin, cryptocurrency, hedgefund"
      }
    }
  },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "about", component: AboutComponent },
  { path: "confirmation/:token", component: ConfirmationPageComponent },
  { path: "forgot_password", component: ForgotPasswordComponent },
  { path: "reset_password/:token", component: ResetPasswordComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: "services", component: ServicesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
