import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  fetchCountryData(isoCode: string) {
    let api = `http://api.worldbank.org/v2/country?per_page=300&format=json`
    const response = fetch(api);
  }
}
