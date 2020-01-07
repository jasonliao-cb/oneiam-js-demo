import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { OneiamModule } from "../../../../src/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { PublicComponent } from "./public/public.component";
import { DeepSecureComponent } from "./secure/deep/deep-secure.component";
import { SecureComponent } from "./secure/secure.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PublicComponent,
    SecureComponent,
    DeepSecureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OneiamModule.forRoot({
      issuer: "https://wwwtest.auth.careerbuilder.com",
      clientId: "demo_client_id"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
