import { Directive, Inject, InjectionToken, Input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormGroup,
} from '@angular/forms';

export const SUB_FORM_CONTAINER = new InjectionToken('SUB_FORM_CONTAINER');

export abstract class SubForm {
  public abstract getSubForm(): AbstractControl;
}

@Directive({
  selector: '[appSubForm]',
})
export class SubFormDirective<T extends SubForm> {
  @Input('appSubForm') appSubForm: string | number;

  constructor(
    private cc: ControlContainer,
    @Inject(SUB_FORM_CONTAINER) private groupContainer: T
  ) {}

  ngOnInit() {
    if ((this.cc.control as FormGroup).addControl) {
      (this.cc.control as FormGroup).addControl(
        this.appSubForm as string,
        this.groupContainer.getSubForm()
      );
    } else {
      (this.cc.control as FormArray).insert(
        this.appSubForm as number,
        this.groupContainer.getSubForm()
      );
    }
  }
}
