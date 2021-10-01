import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ChildFormBase } from "../child-form";

@Component({
  selector: "app-child-two",
  template: `
    <div [formGroup]="form">
      <label>Color:</label>
      <input formControlName="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildTwoComponent implements ChildFormBase {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    color: this.fb.control("", Validators.required),
  });

  public get childForm(): FormGroup {
    return this.form;
  }

  getSubForm(): AbstractControl {
    return this.form;
  }
}
