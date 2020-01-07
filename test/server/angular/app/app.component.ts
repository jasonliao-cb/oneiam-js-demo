import { Component, NgZone } from "@angular/core";
import { OneiamAuthGuard, OneiamService } from "../../../../src/angular";
import { Oneiam } from "../../../../src/oneiam";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public constructor(ngZone: NgZone, oneiam: Oneiam, oneiamService: OneiamService, oneiamAuthGuard: OneiamAuthGuard) {
    // for tests to reference
    const global = window as any;
    global.ngZone = ngZone;
    global.oneiam = oneiam;
    global.oneiamService = oneiamService;
    global.oneiamAuthGuard = oneiamAuthGuard;
  }
}
