import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { pairwise, startWith } from "rxjs/operators";
import { ChildFormBase } from "../child-form";
import { ChildOneComponent } from "../child-one";
import { ChildTwoComponent } from "../child-two";

@Component({
  selector: "app-parent",
  template: `
    <div [formGroup]="form">
      <label>
        <input type="checkbox" formControlName="childFormType" />
        {{ childFormType ? "Type 1" : "Type 2" }}
      </label>

      <div #childContainer></div>
    </div>

    <pre>value: {{ form.value | json }}</pre>
    <pre>valid: {{ form.valid | json }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParentComponent implements ChildFormBase {
  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @ViewChild("childContainer", { read: ViewContainerRef, static: true })
  childContainer!: ViewContainerRef;

  form = this.fb.group({
    childFormType: this.fb.control(true, Validators.required),
  });

  get childFormType(): boolean {
    return this.form.controls["childFormType"].value;
  }

  get childForm(): FormGroup {
    return this.form;
  }

  private childComponents: {
    [type: string]: { component: any };
  } = {
    true: { component: ChildOneComponent },
    false: { component: ChildTwoComponent },
  };

  ngOnInit(): void {
    this.form.controls["childFormType"].valueChanges
      .pipe(startWith(this.childFormType))
      .subscribe((newType) => {
        this.childContainer.clear();

        const { component } = this.childComponents[`${newType}`];

        const factoryInstance =
          this.componentFactoryResolver.resolveComponentFactory<ChildFormBase>(
            component
          );

        const childComponent =
          this.childContainer.createComponent<ChildFormBase>(factoryInstance);

        const childForm = childComponent.instance.childForm;

        for (const control in this.form.controls) {
          if (control === "childFormType") {
            continue;
          }

          this.form.removeControl(control);
        }

        for (const control in childForm.controls) {
          this.form.addControl(control, childForm.controls[control]);
        }
      });
  }
}
