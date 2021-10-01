import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { SubForm, SUB_FORM_CONTAINER } from '../directives';

@Component({
  selector: 'app-parent',
  template: `
    <div [formGroup]="form">
      <label>
        <input type="checkbox" appSubForm="childFormType">
        {{ childFormType ? 'Type 1' : 'Type 2' }}
      </label>

      <div [ngSwitch]="childFormType">
        <app-child-one *ngSwitchCase="true" appSubForm="childOne"></app-child-one>
        
        <div *ngSwitchCase="false">
          ✅ All good
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SUB_FORM_CONTAINER,
      useExisting: ParentComponent,
    },
  ],
})
export class ParentComponent implements SubForm {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    childFormType: this.fb.control(true, Validators.required),
    childOne: this.fb.group({}),
  });

  get childFormType(): boolean {
    return this.form.controls['childFormType'].value;
  }

  public getSubForm(): AbstractControl {
    return this.form;
  }
}
