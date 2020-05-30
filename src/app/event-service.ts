import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as Auth0 from 'auth0-web';
import { Moment } from 'moment';

@Injectable()
export class EventService {
  apiUrl = 'https://events-api-dev.azurewebsites.net/'//'http://127.0.0.1:5000/';

  constructor(private httpClient: HttpClient) { }

  list(date: any): Observable<Event[]> {
    const values = date._i.split('-');
    const year = +values[0];
    const month = +values[1];
    const day = +values[2];

    const body = {day, month, year};
    return this.httpClient.post(this.apiUrl + 'events', body, this.getHttpOptions())
      .pipe(map((result: Event[]) => result));
  }

  reportDuplicates(events: Event[]) {
    return this.httpClient.post(this.apiUrl + 'events/duplicate', events, this.getHttpOptions());
  }

  excludeEvent(eventId) {
    return this.httpClient.post(this.apiUrl + 'events/exclude', {event_id: eventId}, this.getHttpOptions());
  }

  updateEvent(event: Event, originalEvent: Event) {
    return this.httpClient.post(this.apiUrl + 'events/modify', [event, originalEvent], this.getHttpOptions());
  }

  getHttpOptions() {
    const token = Auth0.getAccessToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
}

export class Event {
  constructor(
    public event_id: number,
    public title: string,
    public url: string,
    public poster: string,
    public description: string,
    public place: any,
    public cost: number[],
    public tags: string[],
    public dates: any[],
    public source_event_id) {
  }
}

export function getEventLength(e: Event): number {
  let length = 0;
  e.dates.forEach(d => {
    if ('start' in d) {
      let startDate = new Date();
      if (d.start) {
        startDate = new Date(d.start.year, d.start.month, d.start.day);
      }
      const endDate = new Date(d.end.year, d.end.month, d.end.day);
      const diff = Math.abs(startDate.getTime() - endDate.getTime());
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      length += diffDays;
    } else {
      length += 1;
    }
  });
  return length;
}
