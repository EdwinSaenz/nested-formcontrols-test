import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubForm, SUB_FORM_CONTAINER } from '../directives';

@Component({
  selector: 'app-child-two',
  template: `
    <div [formGroup]="form">
      <label>Color:</label>
      <input formControlName="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SUB_FORM_CONTAINER,
      useExisting: ChildTwoComponent,
    },
  ],
})
export class ChildTwoComponent implements SubForm {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    color: this.fb.control('', Validators.required),
  });

  getSubForm(): FormGroup {
    return this.form;
  }
}
