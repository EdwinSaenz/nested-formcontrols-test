import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SUB_FORM_CONTAINER } from './directives';
import { SubForm } from './directives/bind-form-group.directive';

@Component({
  selector: 'my-app',
  template: `
    <div [formGroup]="form">
      <app-parent appSubForm="model"></app-parent>
    </div>
    <pre> value: {{ value | json }} </pre>
    <pre> valid: {{ valid | json }} </pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SUB_FORM_CONTAINER,
      useExisting: AppComponent,
    },
  ],
})
export class AppComponent implements SubForm {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({});

  get value(): any {
    return this.form.value;
  }

  get valid(): boolean {
    return this.form.valid;
  }

  getSubForm(): FormGroup {
    return this.form;
  }
}
