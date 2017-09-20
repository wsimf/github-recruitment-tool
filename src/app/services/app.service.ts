import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

  constructor() { }

  myData() {
    return 'This is my data, man!';
  }

}
