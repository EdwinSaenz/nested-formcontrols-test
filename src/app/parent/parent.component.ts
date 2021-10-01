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
    [type: string]: { formName: string; component: any };
  } = {
    true: { formName: "childOne", component: ChildOneComponent },
    false: { formName: "childTwo", component: ChildTwoComponent },
  };

  ngOnInit(): void {
    this.form.controls["childFormType"].valueChanges
      .pipe(startWith(null, this.childFormType), pairwise())
      .subscribe(([previousType, newType]) => {
        const { component, formName } = this.childComponents[`${newType}`];

        const factoryInstance =
          this.componentFactoryResolver.resolveComponentFactory<ChildFormBase>(
            component
          );

        const childComponent =
          this.childContainer.createComponent<ChildFormBase>(factoryInstance);

        const childForm = childComponent.instance.childForm;

        this.form.addControl(formName, childForm as FormGroup);

        if (previousType !== null) {
          const { formName: oldForm } = this.childComponents[`${previousType}`];
          this.childContainer.remove(0);
          this.form.removeControl(oldForm);
        }
      });
  }
}
