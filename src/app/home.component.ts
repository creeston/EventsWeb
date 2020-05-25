import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginationDataSource } from './pagination';
import { EventService, Event, getEventLength } from './event-service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as Auth0 from 'auth0-web';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{
  filters: any = {};
  toppings = new FormControl();
  authenticated = false;
  signIn = Auth0.signIn;
  date = new Date();
  signOut = Auth0.signOut;
  getProfile = Auth0.getProfile;
  loading = false;
  events: Event[] = [];

  // dataSource = new PaginationDataSource<Event>(
  //   request => this.events.page(request)
  // );

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    Auth0.subscribe((authenticated) => (this.authenticated = authenticated));
  }

  getEvents(dateEvent: MatDatepickerInputEvent<Date>) {
    this.date = dateEvent.value;
    this.refreshEvents();
  }

  removeEvent(event: Event) {
    const index = this.events.indexOf(event, 0);
    if (index > -1) {
      this.events.splice(index, 1);
    }
  }

  refreshEvents() {
    this.events = [];
    this.loading = true;
    this.eventService.list(this.date).subscribe(r => {
      this.events = this.sortEvents(r);
      this.loading = false;
    });
  }

  sortEvents(events: Event[]): Event[] {
    return events.sort((e1, e2) => getEventLength(e1) - getEventLength(e2));

  }

  // refreshEvents() {
  //   this.dataSource = null;
  //   this.loading = true;
  //   this.dataSource = new PaginationDataSource<Event>(request => this.events.page(request), this.date);
  // }
}
