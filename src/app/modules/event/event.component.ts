import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Event, EventService } from '../../event-service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


const currentYear = new Date().getFullYear();

const monthMapping = [
  null,
  'студзеня',
  'лютага',
  'сакавіка',
  'красавіка',
  'мая',
  'чэрвеня',
  'ліпеня',
  'жнівеня',
  'верасня',
  'кастрычніка',
  'лістапада',
  'снежня'
];

function toDateObject(d: any) {
  if (!d) {
    return null;
  }
  if ('day' in d) {
    return [new Date(d.year, d.month - 1, d.day)];
  } else if ('start' in d){
    return [toDateObject(d.start)[0], toDateObject(d.end)[0]];
  }
}

function toDateString(d: any) {
  if (!d) {
    return null;
  }
  if ('start' in d) {
    const start = toDateString(d.start);
    const end = toDateString(d.end);
    if (!start) {
      return`да ${end}`;
    } else {
      return `з ${start} па ${end}`;
    }
  } else {
    const day = d.day;
    const month = monthMapping[d.month];
    const year = d.year;
    if (year === currentYear) {
      return `${day} ${month}`;
    } else {
      return `${day} ${month} ${year}`;
    }
  }
}

function fromDateObj(date: Date) {
  const values = date.toLocaleDateString().split('/');
  const month = +values[0];
  const day = +values[1];
  const year = +values[2];
  return {year, month, day};
}


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() Model: Event;
  @Output() refreshEventList = new EventEmitter<Event>();

  eventTypeMapping = {
    compete: 'Спаборніцтва',
    concert: 'Канцэрт',
    concert_programm: 'Канцэртная праграма',
    exhibition: 'Выстава',
    festival: 'Фэст',
    food: 'Ежа',
    free: 'Бясплатна',
    game: 'Гульня',
    lecture: 'Лекцыя',
    market: 'Кірмаш',
    online: 'Анлайн',
    party: 'Вечарына',
    show: 'Шоў',
    sport: 'Спорт',
    standup: 'Стэндап',
    theatre: 'Тэатр',
    tour: 'Вандроўка',
    training: 'Занятак',
    view: 'Прагляд'
  };



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
  dates: string[];
  imageStyle: any;

  constructor(private eventService: EventService, private dialog: MatDialog) {

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

    this.dates = [];
    this.Model.dates.forEach(d => {
      if (!d) {
        return;
      }
      this.dates.push(toDateString(d));
    });
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
        if (t in this.eventTypeMapping) {
          this.eventTypes.push(this.eventTypeMapping[t]);
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
      data: {model: this.Model, eventTypeMapping: this.eventTypeMapping}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Model = result;
        this.setFields();
      }
    });
  }

  getImageStyle() {
    return {
      'background-image': 'linear-gradient(rgba(174, 183, 179, .4), rgba(174, 183, 179, .4)), url(' + this.poster + ')',
      'background-repeat': 'cover'
    };
  }
}

class EditEventData {
  model: Event;
  eventTypeMapping: any;
}

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: 'edit-event-dialog.html',
  styleUrls: ['./edit-event-dialog.scss']
})
export class EditEventDialogComponent {
  public model: Event;
  public eventTypeMapping: any;
  objectKeys = Object.keys;
  dateToString = toDateString;
  dates: Date[][] = [];
  dateStrings: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditEventData) {
    this.model = data.model;
    this.eventTypeMapping = data.eventTypeMapping;
    this.model.dates.forEach(d => {
      this.dates.push(toDateObject(d));
      this.dateStrings.push(toDateString(d));
    });
  }

  updateDates(date: MatDatepickerInputEvent<Date>, dateId: number, pairId: number) {
    this.dates[dateId][pairId] = date.value;
    for (let i = 0; i < this.dates.length; i++) {
      const d = this.dates[i];
      if (d.length === 1) {
        this.model.dates[i] = fromDateObj(d[0]);
      } else {
        this.model.dates[i] = {start: fromDateObj(d[0]), end: fromDateObj(d[1])};
      }

      this.dateStrings[i] = toDateString(this.model.dates[i]);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
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
