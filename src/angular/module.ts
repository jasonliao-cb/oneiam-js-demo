import { ModuleWithProviders, NgModule, NgZone } from "@angular/core";
import { Oneiam } from "../oneiam";
import { OneiamConfig } from "../types";
import { OneiamAuthGuard } from "./guard";
import { OneiamService } from "./service";

@NgModule()
export class OneiamModule {
  public static forRoot(config: OneiamConfig): ModuleWithProviders<OneiamModule> {
    return {
      ngModule: OneiamModule,
      providers: [
        {
          provide: "@cb/oneiam:OneiamConfig",
          useValue: config
        },
        {
          provide: OneiamService,
          useClass: OneiamService,
          deps: ["@cb/oneiam:OneiamConfig", NgZone]
        },
        {
          provide: Oneiam,
          useExisting: OneiamService
        },
        {
          provide: OneiamAuthGuard,
          useClass: OneiamAuthGuard,
          deps: [OneiamService, NgZone]
        }
      ]
    };
  }
}
