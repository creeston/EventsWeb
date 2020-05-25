import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchMap, startWith, map, shareReplay } from 'rxjs/operators';
import { Page, Sort, PaginationEndpoint } from './page';
import { SimpleDataSource } from './datasource';

export class PaginationDataSource<T> implements SimpleDataSource<T> {
  private pageNumber = new Subject<number>();
  public page$: Observable<Page<T>>;

  constructor(
    endpoint: PaginationEndpoint<T>,
    date: Date,
    onCompleted,
    size = 20) {
    if (!date) {
      date = new Date();
    }
    this.page$ = endpoint({page: 0, size, date});
  }

  fetch(page: number): void {
    this.pageNumber.next(page);
  }

  connect(): Observable<T[]> {
    return this.page$.pipe(map(page => page.content));
  }

  disconnect(): void {}

}
