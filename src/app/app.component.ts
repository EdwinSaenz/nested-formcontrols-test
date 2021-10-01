import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";

@Component({
  selector: "app-root",
  template: ` <app-parent></app-parent> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
