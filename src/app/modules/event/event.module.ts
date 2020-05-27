import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventComponent, RemoveEventDialogComponent, ThankYouComponent} from './event.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditEventDialogComponent } from './edit-event.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


const COMPONENTS = [
  EventComponent,
  EditEventDialogComponent,
  RemoveEventDialogComponent,
  ThankYouComponent
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
    MaterialModule,
  ],
  exports: COMPONENTS
})
export class EventModule { }
