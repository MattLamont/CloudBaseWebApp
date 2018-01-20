import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppHeaderService {
    private subject = new Subject<any>();

    setAppHeader(header: string) {
        this.subject.next({ header: header });
    }

    getAppHeader(): Observable<any> {
        return this.subject.asObservable();
    }
}
