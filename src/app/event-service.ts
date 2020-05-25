import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as Auth0 from 'auth0-web';

@Injectable()
export class EventService {
  apiUrl = 'http://127.0.0.1:5000/';

  constructor(private httpClient: HttpClient) { }

  list(date: Date): Observable<Event[]> {
    const values = date.toLocaleDateString().split('/');
    const month = +values[0];
    const day = +values[1];
    const year = +values[2];

    const body = {day, month, year};
    return this.httpClient.post(this.apiUrl + 'events', body, this.getHttpOptions())
      .pipe(map((result: Event[]) => result));
  }
  //
  // page(request: PageRequest<Event>): Observable<Page<Event>> {
  //   const params = {
  //     pageNumber: request.page,
  //     pageSize: request.size,
  //   };
  //   const year = request.date.getUTCFullYear();
  //   const month = request.date.getUTCMonth() + 1;
  //   const day = request.date.getUTCDate() + 1;
  //   const token = Auth0.getAccessToken();
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       "Authorization": `Bearer ${token}`
  //     })
  //   };
  //
  //   const body = {day, month, year};
  //   return this.httpClient.post(this.apiUrl + 'events', body, httpOptions)
  //     .pipe(map((result: Event[]) => {
  //       return {
  //         content: result,
  //         size: 0,
  //         number: 0,
  //         totalElements: 2
  //       };
  //     }));
  // }

  excludeEvent(eventId) {
    return this.httpClient.post(this.apiUrl + 'events/exclude', {event_id: eventId}, this.getHttpOptions());
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
    public tags: string[],
    public dates: any[]) {
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
