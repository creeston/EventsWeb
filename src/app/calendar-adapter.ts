import { Moment } from 'moment';
import * as moment from 'moment';
import { DateAdapter, MatDateFormats } from '@angular/material/core';

const MONTHS = {
  short: [
    'Студзень', 'Люты', 'Сакавік', 'Красавік', 'Травень', 'Чэрвень', 'Ліпень', 'Жнівень', 'Верасень',
    'Кастрычнік', 'Лістапад', 'Снежань'
  ],
  long: ['СТУ', 'ЛЮТ', 'САК', 'КРА', 'ТРА', 'ЧЭР', 'ЛІП', 'ЖНІ', 'ВЕР', 'КАС', 'ЛІС', 'СНЕ'],
  narrow: ['С', 'Л', 'С', 'К', 'М', 'Ч', 'Л', 'Ж', 'В', 'К', 'Л', 'С']
};

const DAYS = {
  long: ['Панядзелак', 'Аўторак', 'Серада', 'Чацвер', 'Пятніца', 'Субота', 'Нядзеля'],
  short: ['Пан', 'Аўт', 'Сер', 'Чац', 'Пят', 'Суб', 'Няд'],
  narrow: ['П', 'А', 'С', 'Ч', 'П', 'С', 'Н']
};

export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class MomentDateAdapter extends DateAdapter<Moment> {
    toIso8601(date: Moment): string {
      return '';
    }
    invalid(): Moment {
      return null;
    }

  /**
   * Gets the year component of the given date.
   * @param date The date to extract the year from.
   * @returns The year component.
   */
  getYear(date: Moment): number {
    return date.year();
  }

  /**
   * Gets the month component of the given date.
   * @param date The date to extract the month from.
   * @returns The month component (0-indexed, 0 = January).
   */
  getMonth(date: Moment): number {
    return date.month();
  }

  /**
   * Gets the date of the month component of the given date.
   * @param date The date to extract the date of the month from.
   * @returns The month component (1-indexed, 1 = first of month).
   */
  getDate(date: Moment): number {
    return date.date();
  }

  /**
   * Gets the day of the week component of the given date.
   * @param date The date to extract the day of the week from.
   * @returns The month component (0-indexed, 0 = Sunday).
   */
  getDayOfWeek(date: Moment): number {
    return date.day();
  }

  /**
   * Gets a list of names for the months.
   * @param style The naming style (e.g. long = 'January', short = 'Jan', narrow = 'J').
   * @returns An ordered list of all month names, starting with January.
   */
  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return MONTHS[style];
  }

  /**
   * Gets a list of names for the dates of the month.
   * @returns An ordered list of all date of the month names, starting with '1'.
   */
  getDateNames(): string[] {
    const dateNames = [];
    for (let i = 1; i <= 31; i++) {
      dateNames.push(i.toString());
    }

    return dateNames;
  }

  /**
   * Gets a list of names for the days of the week.
   * @param style The naming style (e.g. long = 'Sunday', short = 'Sun', narrow = 'S').
   * @returns An ordered list of all weekday names, starting with Sunday.
   */
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return DAYS[style];
  }

  /**
   * Gets the name for the year of the given date.
   * @param date The date to get the year name for.
   * @returns The name of the given year (e.g. '2017').
   */
  getYearName(date: Moment): string {
    return date.year().toString();
  }

  /**
   * Gets the first day of the week.
   * @returns The first day of the week (0-indexed, 0 = Sunday).
   */
  getFirstDayOfWeek(): number {
    return 1;
  }

  /**
   * Gets the number of days in the month of the given date.
   * @param date The date whose month should be checked.
   * @returns The number of days in the month of the given date.
   */
  getNumDaysInMonth(date: Moment): number {
    return date.daysInMonth();
  }

  /**
   * Clones the given date.
   * @param date The date to clone
   * @returns A new date equal to the given date.
   */
  clone(date: Moment): Moment {
    return date.clone();
  }

  /**
   * Creates a date with the given year, month, and date. Does not allow over/under-flow of the
   * month and date.
   * @param year The full year of the date. (e.g. 89 means the year 89, not the year 1989).
   * @param month The month of the date (0-indexed, 0 = January). Must be an integer 0 - 11.
   * @param date The date of month of the date. Must be an integer 1 - length of the given month.
   * @returns The new date, or null if invalid.
   */
  createDate(year: number, month: number, date: number): Moment {
    const value = year + '-' + (month + 1) + '-' + date;
    const theDate = moment(value, 'YYYY-MM-DD');
    return theDate.isValid() ? theDate : null;
  }

  /**
   * Gets today's date.
   * @returns Today's date.
   */
  today(): Moment {
    return moment();
  }

  /**
   * Parses a date from a value.
   * @param value The value to parse.
   * @param parseFormat The expected format of the value being parsed
   *     (type is implementation-dependent).
   * @returns The parsed date, or null if date could not be parsed.
   */
  parse(value: any, parseFormat: any): Moment | null {
    return moment(value, parseFormat);
  }

  /**
   * Formats a date as a string.
   * @param date The value to parse.
   * @param displayFormat The format to use to display the date as a string.
   * @returns The parsed date, or null if date could not be parsed.
   */
  format(date: Moment, displayFormat: any): string {
    if (!date.isValid()) {
      throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    return date.locale('be').format(displayFormat);
  }

  /**
   * Adds the given number of years to the date. Years are counted as if flipping 12 pages on the
   * calendar for each year and then finding the closest date in the new month. For example when
   * adding 1 year to Feb 29, 2016, the resulting date will be Feb 28, 2017.
   * @param date The date to add years to.
   * @param years The number of years to add (may be negative).
   * @returns A new date equal to the given one with the specified number of years added.
   */
  addCalendarYears(date: Moment, years: number): Moment {
    return date.clone().add(years, 'years');
  }
  /**
   * Adds the given number of months to the date. Months are counted as if flipping a page on the
   * calendar for each month and then finding the closest date in the new month. For example when
   * adding 1 month to Jan 31, 2017, the resulting date will be Feb 28, 2017.
   * @param date The date to add months to.
   * @param months The number of months to add (may be negative).
   * @returns A new date equal to the given one with the specified number of months added.
   */
  addCalendarMonths(date: Moment, months: number): Moment {
    return date.clone().add(months, 'months');
  }

  /**
   * Adds the given number of days to the date. Days are counted as if moving one cell on the
   * calendar for each day.
   * @param date The date to add days to.
   * @param days The number of days to add (may be negative).
   * @returns A new date equal to the given one with the specified number of days added.
   */
  addCalendarDays(date: Moment, days: number): Moment {
    return date.clone().add(days, 'days');
  }

  /**
   * Gets the RFC 3339 compatible date string (https://tools.ietf.org/html/rfc3339)  for the given
   * date.
   * @param date The date to get the ISO date string for.
   * @returns The ISO date string date string.
   */
  getISODateString(date: Moment): string {
    return date.toISOString();
  }

  /**
   * Checks whether the given date is valid.
   * @param date The date to check.
   * @returns Whether the date is valid.
   */
  isValid(date: Moment): boolean {
    return date.isValid();
  }

  /**
   * Checks whether the given object is considered a date instance by this DateAdapter.
   * @param obj The object to check
   * @returns Whether the object is a date instance.
   */
  isDateInstance(date: Moment): boolean {
    return moment.isMoment(date);
  }
}
