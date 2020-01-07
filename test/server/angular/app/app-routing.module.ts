import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OneiamAuthGuard } from "../../../../src/angular";
import { HomeComponent } from "./home/home.component";
import { PublicComponent } from "./public/public.component";
import { DeepSecureComponent } from "./secure/deep/deep-secure.component";
import { SecureComponent } from "./secure/secure.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "",
    canActivateChild: [OneiamAuthGuard],
    children: [
      {
        path: "public",
        component: PublicComponent
      },
      {
        path: "secure",
        component: SecureComponent,
        data: { requireAuthentication: true }
      },
      {
        path: "secure",
        data: { requireAuthentication: true },
        children: [
          {
            path: "deep",
            component: DeepSecureComponent
          }
        ]
      }
    ]
  },
  {
    path: "**",
    redirectTo: "/"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
