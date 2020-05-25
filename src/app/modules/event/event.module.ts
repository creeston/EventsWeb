import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {EditEventDialogComponent, EventComponent, RemoveEventDialogComponent} from './event.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const COMPONENTS = [
  EventComponent,
  EditEventDialogComponent,
  RemoveEventDialogComponent
];

export const routes = [
  {
    path: ''
  }
];


@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: COMPONENTS
})
export class EventModule { }
