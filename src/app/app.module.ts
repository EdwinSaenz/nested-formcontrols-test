import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ParentComponent } from './parent/parent.component';
import { ChildOneComponent } from './child-one';
import { ChildTwoComponent } from './child-two';
import { SubFormDirective } from './directives';

@NgModule({
  imports: [BrowserModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    AppComponent,
    ParentComponent,
    ChildOneComponent,
    ChildTwoComponent,
    SubFormDirective,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
