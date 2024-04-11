import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface Country {
  name: string;
  capital: string;
  region: string;
  incomeLevel: string;
  latitude: string;
  longitude: string;
}

interface WorldBankResponse {
  [index: number]: any;
  1: any[];
}


@Component({
  selector: 'app-svg-map',
  templateUrl: './svg-map.component.html',
  styleUrls: ['./svg-map.component.css']
})


export class SvgMapComponent implements OnInit {
  countryData: { [isoCode: string]: Country } = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData().then(() => {
      this.setupCountryClickListener();
    });
  }

  async fetchData() {
    try {
      const response = await firstValueFrom(
        this.http.get<WorldBankResponse>(`http://api.worldbank.org/v2/country?per_page=300&format=json`)
      );
      const data = response[1];
      for (const item of data) {
        try {
          const country = {
            name: item.name,
            capital: item.capitalCity || "N/A",
            region: item.region.value || "N/A",
            incomeLevel: item.incomeLevel.value || "N/A",
            latitude: item.latitude || "N/A",
            longitude: item.longitude || "N/A"
          };
          this.countryData[item.iso2Code] = country;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching World Bank data:', error);
    }
  }

  setupCountryClickListener() {
    Object.keys(this.countryData).forEach(isoCode => {
      const countryElement = document.getElementById(isoCode);
      if (countryElement) {
        countryElement.addEventListener('click', (evt) => {
          this.showTableInformation(evt, isoCode);
        });
      }
    });
  }

  showTableInformation(evt: MouseEvent, isoCode: string): void {

    document.querySelectorAll('svg path.clicked').forEach(element => {
      element.classList.remove('clicked');
    });
    const clickedElement = evt.target as Element;
    if (clickedElement.tagName === 'path') {
        clickedElement.classList.add('clicked');
    }
    const countryName = document.querySelector('.countryName');
    const countryCapital = document.querySelector('.countryCapital');
    const countryRegion = document.querySelector('.countryRegion');
    const countryIncomeLevel = document.querySelector('.countryIncome');
    const countryLatitude = document.querySelector('.countryLatitude');
    const countryLongitude = document.querySelector('.countryLongitude');

    const countryDisplay = this.countryData[isoCode];
    if (countryDisplay) {
      if (countryName) countryName.innerHTML = countryDisplay.name;
      if (countryCapital) countryCapital.innerHTML = countryDisplay.capital;
      if (countryRegion) countryRegion.innerHTML = countryDisplay.region;
      if (countryIncomeLevel) countryIncomeLevel.innerHTML = countryDisplay.incomeLevel;
      if (countryLatitude) countryLatitude.innerHTML = countryDisplay.latitude;
      if (countryLongitude) countryLongitude.innerHTML = countryDisplay.longitude;
    } else {
      console.log('Error with fetching data to be displayed');
    }
  }

  async searchBarFunction(event: Event): Promise<void> {
    event.preventDefault();
    const submitValue = document.querySelector('#searchBar') as HTMLInputElement;
    if (!submitValue || !submitValue.value) {
      return;
    }

    let countryCode = document.querySelector('.countryCode');
    let currencyCode = document.querySelector('.currencyCode');

    let countryName = submitValue.value.trim();
    if (countryName.toLowerCase() === 'united states') {
      countryName = countryName.replace(/\s+/g, '');
    }

    try {
      const searchCountryData = await firstValueFrom(this.http.get<any>(`http://api.geonames.org/search?q=${countryName}&maxRows=10&username=ilovechocolates05&type=json`));
      const searchedCountryCode = searchCountryData.geonames[0].countryCode;
      const receivedData = await firstValueFrom(this.http.get<any>(`http://api.geonames.org/countryInfo?country=${searchedCountryCode}&username=ilovechocolates05&type=json`))

      if (receivedData.geonames.length > 0) {
        const countryInfo = receivedData.geonames[0];

        if (countryCode) countryCode.innerHTML = countryInfo.countryCode;
        if (currencyCode) currencyCode.innerHTML = countryInfo.currencyCode;
      } else {
        if (countryCode) countryCode.innerHTML = "no results";

        if (currencyCode) currencyCode.innerHTML = "no results";
        console.log('Unable to display country information')
      }
    } catch (error) {
      console.log("Error fetching searched data: ", error);
    }

  }
}; 