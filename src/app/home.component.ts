import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventService, Event, getEventLength } from './event-service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { eventTypeMapping } from './modules/event/event.component';
import * as Auth0 from 'auth0-web';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {MOMENT_DATE_FORMATS, MomentDateAdapter} from './calendar-adapter';
import {toDateObject} from './modules/event/edit-event.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter },
    {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS},
  ],
})
export class HomeComponent  implements OnInit{
  filters: any = {
    free: false, kids: false
  };
  eventTypes = new FormControl();
  authenticated = false;
  signIn = Auth0.signIn;
  date = new Date();
  signOut = Auth0.signOut;
  getProfile = Auth0.getProfile;
  loading = false;
  events: Event[] = [];
  filteredEvents: Event[] = [];
  eventTypeList: string[] = [];
  eventTypeMapping = eventTypeMapping;
  notEventType = [
    'free',
    'kids'
  ];

  onTypeChange(e) {
    this.filterEvents();
  }

  constructor(private eventService: EventService) {}

  ngOnInit() {
    Auth0.subscribe((authenticated) => (this.authenticated = authenticated));
    for (const key in this.eventTypeMapping) {
      if (this.notEventType.indexOf(key) >= 0) {
        continue;
      }
      this.eventTypeList.push(key);
    }
  }

  getEvents(dateEvent: MatDatepickerInputEvent<Date>) {
    this.date = dateEvent.value;
    this.refreshEvents();
  }

  filterEvents() {
    this.filteredEvents = [];
    for (const event of this.events) {
      if (this.filters.free && event.tags.indexOf('free') === -1) {
        return;
      }
      if (this.filters.kids && event.tags.indexOf('kids') === -1) {
        return;
      }
      if (!this.eventTypes.value || this.eventTypes.value.length === 0) {
        this.filteredEvents.push(event);
      } else {
        for (const type of this.eventTypes.value) {
          if (event.tags.indexOf(type) >= 0) {
            this.filteredEvents.push(event);
            break;
          }
        }
      }
    }
  }

  removeEvent(event: Event) {
    const index = this.events.indexOf(event, 0);
    if (index > -1) {
      this.events.splice(index, 1);
      this.filterEvents();
    }
  }

  refreshEvents() {
    this.events = [];
    this.loading = true;
    return this.eventService.list(this.date).subscribe(r => {
      this.events = this.sortEvents(r);
      this.loading = false;
      this.events.forEach(e => {
        // Leave only first date (usually there will be only one date)
        e.dates = [e.dates[0]];
      });
      this.filterEvents();
    });
  }

  sortEvents(events: Event[]): Event[] {
    const oneDayEvents = [];
    const rangeEvents = [];
    for (const e of events) {
      if (getEventLength(e) === 1) {
        oneDayEvents.push(e);
      } else {
        rangeEvents.push(e);
      }
    }
    oneDayEvents.sort((e1, e2) => toDateObject(e1.dates[0])[0].getTime() - toDateObject(e2.dates[0])[0].getTime());
    rangeEvents.sort((e1, e2) => getEventLength(e1) - getEventLength(e2));
    return oneDayEvents.concat(rangeEvents);
  }
}
