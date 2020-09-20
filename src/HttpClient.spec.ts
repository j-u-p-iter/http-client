import axios from 'axios';

import { HttpClient } from './HttpClient';


describe('HttpClient', () => {
  let httpClient;

  beforeAll(() => {
    httpClient = new HttpClient(axios);
  });

  it('works properly', () => {
    expect(httpClient).toBeDefined();
  });
});
