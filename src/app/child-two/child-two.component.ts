import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-child-two',
  template: `
    <div [formGroup]="form">
      <label>Color:</label>
      <input formGroupName="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ChildTwoComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ChildTwoComponent,
    },
  ],
})
export class ChildTwoComponent
  implements ControlValueAccessor, OnDestroy, Validator
{
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    color: this.fb.control('', Validators.required),
  });

  private onTouched: () => void;
  private onChangeSubs: Subscription[] = [];

  ngOnDestroy(): void {
    for (const sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  writeValue(childTwo: { color: string }): void {
    this.form.patchValue(childTwo, { emitEvent: false });
  }

  registerOnChange(onChange: (childTwo: { color: string }) => void): void {
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
