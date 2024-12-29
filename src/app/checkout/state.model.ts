export interface State {
  id: number;
  name: string;
}

export interface GetStateResponse {
  _embedded: {
    states: State[];
  };
}
