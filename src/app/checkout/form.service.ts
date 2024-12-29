import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Country, GetCountryResponse } from './country.model';
import { GetStateResponse, State } from './state.model';

@Injectable({
  providedIn: 'root',
})
export class FormService implements OnInit {
  private readonly BASE_URL = 'http://localhost:8081/api';

  httpClient = inject(HttpClient);

  creditCardMonths = signal<number[]>([]);
  creditCardYears = signal<number[]>([]);

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // months are 0-indexed, so adding 1 to get 1-based month

  ngOnInit() {
    // Populating years from the current year to the next 10 years
    const startYear = this.currentYear;
    const endYear = startYear + 10;
    let years: number[] = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    this.creditCardYears.set(years);

    // Populating months dynamically
    this.updateCreditCardMonths();
  }

  // Method to update credit card months based on the selected year
  updateCreditCardMonths(selectedYear: number = this.currentYear) {
    let months: number[] = [];

    // If the selected year is the current year, only show months starting from the current month
    if (selectedYear === this.currentYear) {
      for (let month = this.currentMonth; month <= 12; month++) {
        months.push(month);
      }
    } else {
      // Otherwise, show all months
      for (let month = 1; month <= 12; month++) {
        months.push(month);
      }
    }

    this.creditCardMonths.set(months);
  }

  getAvailableContries(): Observable<Country[]> {
    return this.httpClient
      .get<GetCountryResponse>(`${this.BASE_URL}/countries`)
      .pipe(map((response) => response._embedded.countries));
  }

  getStatesForContry(code: string): Observable<State[]> {
    return this.httpClient
      .get<GetStateResponse>(
        `${this.BASE_URL}/states/search/findByCountryCode?code=${code}`
      )
      .pipe(map((response) => response._embedded.states));
  }
}
