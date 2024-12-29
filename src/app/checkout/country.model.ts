export interface Country {
  id: number;
  code: string;
  name: string;
}

export interface GetCountryResponse {
  _embedded: {
    countries: Country[];
  };
}
