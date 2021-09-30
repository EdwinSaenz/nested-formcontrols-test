import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-child-one',
  template: `
    <ng-container [formGroup]="form">
      <label>Some Input</label>
      <input formControlName="input" />

      
    </ng-container>
  `,
})
export class ChildOneComponent {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    name: this.fb.control(''),
    items: this.fb.array([]),
  });
}
