import { Observable } from 'rxjs';

export interface Sort<T> {
  property: keyof T;
  order: 'asc' | 'desc';
}

export interface PageRequest<T> {
  page: number;
  size: number;
  date: Date;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}

export type PaginationEndpoint<T> = (req: PageRequest<T>) => Observable<Page<T>>;
