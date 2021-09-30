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
  selector: 'app-parent',
  template: `
    <div [formGroup]="form">
      <label>
        <input type="checkbox" formControlName="childFormType">
        {{ childFormType ? 'Type 1' : 'Type 2' }}
      </label>

      <div [ngSwitch]="childFormType">
        <app-child-one *ngSwitchCase="true" formGroupName="childOne"></app-child-one>
        
        <div *ngSwitchCase="false">
          All good
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ParentComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ParentComponent,
    },
  ],
})
export class ParentComponent
  implements ControlValueAccessor, OnDestroy, Validator
{
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    childFormType: this.fb.control(true, Validators.required),
    childOne: this.fb.group({}),
  });

  get childFormType(): boolean {
    return this.form.controls['childFormType'].value;
  }

  private onTouched: () => void;
  private onChangeSubs: Subscription[] = [];

  ngOnDestroy(): void {
    for (const sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  writeValue(model: any): void {
    this.form.patchValue(model, { emitEvent: false });
  }

  registerOnChange(onChange: (model: any) => void): void {
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
