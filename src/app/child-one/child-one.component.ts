import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormArray,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  ValidationErrors,
  ControlContainer,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';

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
})
export class ChildOneComponent
  implements ControlValueAccessor, OnInit, OnDestroy, Validator
{
  constructor(
    private fb: FormBuilder,
    private controlContainer: ControlContainer
  ) {}

  form = this.fb.group({
    name: this.fb.control(''),
    items: this.fb.array([]),
  });

  get items(): FormArray {
    return this.form.controls['items'] as FormArray;
  }

  addItem(): void {
    this.items.push(this.fb.group({}));
  }

  private onTouched: () => void;
  private onChangeSubs: Subscription[] = [];

  ngOnInit(): void {
    const formGroup = this.controlContainer.control as FormGroup;
    if (!formGroup.addControl) {
      return;
    }

    formGroup.addControl('name', this.form.controls['name']);
    formGroup.addControl('items', this.form.controls['items']);
  }

  ngOnDestroy(): void {
    for (const sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  writeValue(childOne: { input: string; items: { color: string }[] }): void {
    this.form.patchValue(childOne, { emitEvent: false });
  }

  registerOnChange(
    onChange: (childOne: { input: string; items: { color: string }[] }) => void
  ): void {
    this.onChangeSubs.push(this.form.valueChanges.subscribe(onChange));
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.form[['enable', 'disable'][+isDisabled]]();
  }

  validate(): ValidationErrors {
    if (this.form.valid) {
      return null;
    }

    return this.form.errors;
  }
}
