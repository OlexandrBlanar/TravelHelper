import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MapService {

    place = new BehaviorSubject('');
    placeInfo = new BehaviorSubject('');

    constructor() { }

}
