import { Event, EventService } from '../../event-service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { deepCopy } from 'deep-copy-ts';

export class EditEventData {
  model: Event;
  eventTypeMapping: any;
}

const currentYear = new Date().getFullYear();

const monthMapping = [
  null,
  'студзеня',
  'лютага',
  'сакавіка',
  'красавіка',
  'траўня',
  'чэрвеня',
  'ліпеня',
  'жнівеня',
  'верасня',
  'кастрычніка',
  'лістапада',
  'снежня'
];


export function toDateObject(d: any) {
  if (!d) {
    return null;
  }
  if ('day' in d) {
    if ('hour' in d) {
      return [new Date(d.year, d.month - 1, d.day, d.hour, d.minute)];
    } else {
      return [new Date(d.year, d.month - 1, d.day)];
    }
  } else if ('start' in d){
    let start = toDateObject(d.start);
    if (start) {
      start = start[0];
    }
    return [start, toDateObject(d.end)[0]];
  }
}

export function toDateString(d: any) {
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
    let dateString = '';
    if (year === currentYear) {
      dateString = `${day} ${month}`;
    } else {
      dateString = `${day} ${month} ${year}`;
    }
    if ('hour' in d && d.hour > 0) {
      let minuteString = `${d.minute}`;
      if (minuteString.length === 1) {
        minuteString = '0' + minuteString;
      }
      dateString += `, ${d.hour}:${minuteString}`;
    }
    return dateString;
  }
}

export function fromDateObj(date: Date) {
  const values = date.toLocaleDateString().split('/');
  const month = +values[0];
  const day = +values[1];
  const year = +values[2];

  const hour = date.getHours();
  const minute = date.getMinutes();
  if (hour === 0 && minute === 0) {
    return {year, month, day};
  } else {
    return {year, month, day, hour, minute};
  }
}

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: 'edit-event-dialog.html',
  styleUrls: ['./edit-event-dialog.scss']
})
export class EditEventDialogComponent {
  public model: Event;
  public originalModel: Event;
  public eventTypeMapping: any;
  objectKeys = Object.keys;
  dateToString = toDateString;
  date: Date[] = [];
  time = {hour: 0, minute: 0};
  dateString: string;
  hours = [];
  minutes = [];

  constructor(
    public dialogRef: MatDialogRef<EditEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditEventData, private eventService: EventService) {
    this.model = data.model;
    this.originalModel = deepCopy(this.model);
    this.eventTypeMapping = data.eventTypeMapping;
    this.date = toDateObject(this.model.dates[0]);
    this.time = null;
    if (this.date.length === 1) {
      this.time = {hour: this.date[0].getHours(), minute: this.date[0].getMinutes()};
    }
    this.dateString = toDateString(this.model.dates[0]);
    this.hours = [...Array(24).keys()];
    for (let min = 0; min < 13; min++) {
      this.minutes.push(min * 5);
    }
  }

  updateDates(date: MatDatepickerInputEvent<Date>, pairId: number) {
    this.date[pairId] = date.value;
    if (this.date.length === 1) {
      this.date[0].setMinutes(this.time.minute);
      this.date[0].setHours(this.time.hour);
    }
    this.refreshDate();
  }

  updateHour(hour: MatSelectChange) {
    this.date[0].setHours(hour.value);
    this.refreshDate();
  }

  updateMinute(minute: MatSelectChange) {
    this.date[0].setMinutes(minute.value);
    this.refreshDate();
  }

  refreshDate() {
    const d = this.date;
    if (d.length === 1) {
      this.model.dates[0] = fromDateObj(d[0]);
    } else {
      const newDate = {start: null, end: null};
      if (d[0]) {
        newDate.start = fromDateObj(d[0]);
      }
      if (d[1]) {
        newDate.end = fromDateObj(d[1]);
        delete newDate.end.minute;
        delete newDate.end.hour;

      }
      this.model.dates[0] = newDate;
    }

    this.dateString = toDateString(this.model.dates[0]);
  }

  removeDate() {
    this.date = [this.date[0]];
    this.time = {hour: 0, minute: 0};
    this.refreshDate();
  }

  addDate() {
    this.date[0].setHours(0);
    this.date[0].setMinutes(0);
    this.date = [this.date[0], new Date()];
    this.refreshDate();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.eventService.updateEvent(this.model, this.originalModel).subscribe(r => {
      if ('event_id' in r) {
        this.model.event_id = r['event_id'];
        this.model.source_event_id = r['source_event_id'];
      }
      this.dialogRef.close(this.model);
    });
  }

}
