import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Event, EventService } from '../../event-service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {EditEventDialogComponent, toDateString} from './edit-event.component';


export const eventTypeMapping = {
  online: 'Анлайн',
  free: 'Бясплатна',
  tour: 'Вандроўка',
  party: 'Вечарына',
  exhibition: 'Выстава',
  game: 'Гульня',
  food: 'Ежа',
  training: 'Занятак',
  concert: 'Канцэрт',
  concert_programm: 'Канцэртная праграма',
  market: 'Кірмаш',
  lecture: 'Лекцыя',
  view: 'Прагляд',
  compete: 'Спаборніцтва',
  sport: 'Спорт',
  standup: 'Стэндап',
  theatre: 'Тэатр',
  festival: 'Фэст',
  show: 'Шоў',
};

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() Model: Event;
  @Output() refreshEventList = new EventEmitter<Event>();

  defaultPosters = [
    'concert',
    'concert_programm',
    'lecture',
    'training',
    'sport',
    'party',
    'market',
    'food',
    'exhibition'
  ];

  title: string;
  sourceType: string;
  place: string;
  address: string;
  poster: string;
  description: string[] = [];
  isFree: boolean;
  isRegister: boolean;
  eventTypes: string[] = [];
  date: string;
  imageStyle: any;
  cost: string;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {

  }

  setFields() {
    this.eventTypes = [];
    this.description = [];
    this.Model.description.split(/[\n!?.]/).forEach(d => {
      d = d.replace('\n', '');
      if (d.length === 0) {
        return;
      }
      this.description.push(d + '.');
    });

    this.description.splice(this.description.length - 1, 1);
    this.description[this.description.length - 1] += '..';

    this.date = toDateString(this.Model.dates[0]);
    this.title = this.Model.title;
    let url = this.Model.url;
    url = url.substring(8, url.length);
    const slashIndex = url.indexOf('/');
    this.sourceType = url.substring(0, slashIndex);
    if (this.Model.place) {
      this.address = this.Model.place.address;
      this.place = this.Model.place.name;
    }

    const tags = this.Model.tags;
    if (tags) {
      if (tags.indexOf('free') > 0) {
        this.isFree = true;
      }
      if (tags.indexOf('register') > 0) {
        this.isRegister = true;
      }
      tags.forEach(t => {
        if (t in eventTypeMapping) {
          this.eventTypes.push(eventTypeMapping[t]);
        }
      });
    }

    this.poster = this.Model.poster;
    if (!this.poster || this.poster === 'null') {
      if (this.Model.tags && this.Model.tags.length > 0) {
        this.Model.tags.forEach(t => {
          if (this.defaultPosters.includes(t)) {
            this.poster = `assets/events/${t}.png`;
          }
        });
      }
    }
    this.imageStyle = this.getImageStyle();
    if (this.Model.cost && this.Model.cost.length > 0) {
      const modelCost = this.Model.cost.sort((n1, n2) => n1 - n2);
      if (modelCost.length === 1) {
        this.cost = `${modelCost[0]} руб.`;
      } else {
        this.cost = `${modelCost[0]}  - ${modelCost[modelCost.length - 1]} руб.`;
      }
    }
  }

  ngOnInit() {
    this.setFields();
  }

  excludeEvent() {
    const self = this;
    const dialogRef = this.dialog.open(RemoveEventDialogComponent, {width: '200px'});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.excludeEvent(this.Model.event_id).subscribe(response => {
          self.refreshEventList.emit(self.Model);
        });
      }
    });
  }

  editEvent() {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      width: '450px',
      data: {model: this.Model, eventTypeMapping}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Model = result;
        this.setFields();
        this.snackBar.openFromComponent(ThankYouComponent, {duration: 5 * 1000});
      }
    });
  }

  getImageStyle() {
    return {
      'background-image': 'linear-gradient(rgba(255, 255, 255, .2), rgba(255, 255, 255, .2)), url(' + this.poster + ')',
      'background-repeat': 'cover'
    };
  }
}

@Component({
  selector: 'app-remove-event-dialog',
  templateUrl: 'remove-event-confirmation-dialog.html',
  styleUrls: ['./edit-event-dialog.scss']
})
export class RemoveEventDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditEventDialogComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-thank-you-snack',
  templateUrl: 'thank-you-snack-component.html',
})
export class ThankYouComponent {}
