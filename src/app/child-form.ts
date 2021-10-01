import { FormGroup } from "@angular/forms";

export abstract class ChildFormBase {
  public abstract get childForm(): FormGroup;
}
