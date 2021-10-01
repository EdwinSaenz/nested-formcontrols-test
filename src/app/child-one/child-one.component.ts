import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
import { ChildFormBase } from "../child-form";
import { ChildTwoComponent } from "../child-two";

@Component({
  selector: "app-child-one",
  template: `
    <div [formGroup]="form">
      <label>Name:</label>
      <input formControlName="name" />

      <div #childrenContainer></div>

      <button (click)="addItem()">Add item</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildOneComponent implements ChildFormBase {
  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @ViewChild("childrenContainer", { read: ViewContainerRef, static: true })
  childContainer!: ViewContainerRef;

  form = this.fb.group({
    name: this.fb.control("", Validators.required),
    items: this.fb.array([]),
  });

  get items(): FormArray {
    return this.form.controls["items"] as FormArray;
  }

  get childForm(): FormGroup {
    return this.form;
  }

  addItem(): void {
    const factoryInstance =
      this.componentFactoryResolver.resolveComponentFactory<ChildFormBase>(
        ChildTwoComponent
      );

    const childComponent =
      this.childContainer.createComponent<ChildFormBase>(factoryInstance);

    const childForm = childComponent.instance.childForm;

    this.items.push(childForm);
  }
}
