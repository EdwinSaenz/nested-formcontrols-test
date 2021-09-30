import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-parent',
  template: `
    <ng-container [formGroup]="form">
      <label>
        <input type="checkbox" formControlName="childFormType">
        {{ childFormType ? 'Type 1' : 'Type 2' }}
      </label>

      <ng-container [ngSwitch]="childFormType">
        <app-child-one *ngSwitchCase="true"></app-child-one>
        
        <!-- <app-child-two *ngSwitchCase="true"></app-child-two> -->
      </ng-container>

      <pre>form.value: {{ form.value | json }}</pre>
    </ng-container>
  `,
})
export class ParentComponent {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    childFormType: this.fb.control(true, Validators.required),
  });

  get childFormType(): boolean {
    return this.form.controls['childFormType'].value;
  }
}
