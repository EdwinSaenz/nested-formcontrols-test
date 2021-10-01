import { Directive, Inject, InjectionToken, Input } from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormGroup,
} from "@angular/forms";

export const SUB_FORM_CONTAINER = new InjectionToken("SUB_FORM_CONTAINER");

export abstract class SubForm {
  public abstract getSubForm(): AbstractControl;
}

@Directive({
  selector: "[appSubForm]",
})
export class SubFormDirective<T extends SubForm> {
  @Input("appSubForm")
  formName!: string | number;

  constructor(
    private cc: ControlContainer,
    @Inject(SUB_FORM_CONTAINER) private groupContainer: T
  ) {}

  ngOnInit() {
    if (this.isFormGroup(this.cc.control)) {
      if (!this.cc.control.contains(this.formName as string)) {
        this.cc.control.addControl(
          this.formName as string,
          this.groupContainer.getSubForm()
        );
      }
    }

    if (this.isFormArray(this.cc.control)) {
      this.cc.control.removeAt(this.formName as number);
      this.cc.control.insert(
        this.formName as number,
        this.groupContainer.getSubForm()
      );
    }
  }

  private isFormGroup(control: AbstractControl | null): control is FormGroup {
    return !!(control as FormGroup).addControl;
  }

  private isFormArray(control: AbstractControl | null): control is FormArray {
    return !!(control as FormArray).insert;
  }
}
