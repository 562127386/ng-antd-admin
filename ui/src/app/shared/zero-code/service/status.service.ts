import {Injectable} from '@angular/core';
import { MenuVo } from '../model/erupt-menu';

@Injectable({
    providedIn: 'root'
})
export class StatusService {

    isFillLayout: boolean = false;

    menus: MenuVo[] = [];

    constructor() {
    }

}
