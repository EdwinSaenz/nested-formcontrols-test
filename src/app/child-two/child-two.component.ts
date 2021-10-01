import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
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
      <input appSubForm="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildTwoComponent
  implements ControlValueAccessor, OnInit, OnDestroy, Validator
{
  constructor(
    private fb: FormBuilder,
    private controlContainer: ControlContainer
  ) {}

  form = this.fb.group({
    color: this.fb.control('', Validators.required),
  });

  private onTouched: () => void;
  private onChangeSubs: Subscription[] = [];

  ngOnInit(): void {
    const formGroup = this.controlContainer.control as FormGroup;
    if (!formGroup.addControl) {
      return;
    }

    formGroup.addControl('color', this.form.controls['color']);
  }

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
