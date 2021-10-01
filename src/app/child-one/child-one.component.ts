import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { SubForm, SUB_FORM_CONTAINER } from '../directives';

@Component({
  selector: 'app-child-one',
  template: `
    <div [formGroup]="form">
      <label>Name:</label>
      <input appSubForm="name" />

      <div formArrayName="items">
        <div *ngFor="let control of items.controls; let i = index">
          <app-child-two [appSubForm]="i"></app-child-two>
        </div>
      </div>

      <button (click)="addItem()">Add item</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SUB_FORM_CONTAINER,
      useExisting: ChildOneComponent,
    },
  ],
})
export class ChildOneComponent implements SubForm {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    name: this.fb.control('', Validators.required),
    items: this.fb.array([]),
  });

  get items(): FormArray {
    return this.form.controls['items'] as FormArray;
  }

  addItem(): void {
    this.items.push(this.fb.group({}));
  }

  getSubForm(): FormGroup {
    return this.form;
  }
}
