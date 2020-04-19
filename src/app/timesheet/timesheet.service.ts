import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { data } from "./data.model";
import { HttpClient } from "@angular/common/http";
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class TimesheetService {

  events: Array<data> = [
    {
      id: 1,
      date: new Date(),
      start: this.setHours(0),
      end: null,
      totalHours: 0,
      text: "Record 1",
      dateFormat: this.fromDateModel(new Date()),
      timeStartFormat: this.fromTimeModel(new Date()),
      timeEndFormat: { hour: 0, minute: 0, second: 0 }
    },
    {
      id: 2,
      date: new Date(),
      start: this.setHours(3),
      end: null,
      totalHours: 0,
      text: "Record 2",
      dateFormat: this.fromDateModel(new Date()),
      timeStartFormat: this.fromTimeModel(new Date()),
      timeEndFormat: { hour: 0, minute: 0, second: 0 }
    }
  ];

  constructor(private http: HttpClient) {
  }

  fromDateModel(date: Date): NgbDateStruct {
    return { day: date.getUTCDay(), month: date.getUTCMonth(), year: date.getUTCFullYear() };
  }

  fromTimeModel(date: Date): NgbTimeStruct {
    return { hour: date.getUTCHours(), minute: date.getUTCMinutes(), second: 0 };
  }

  getEvents(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
        observer.complete();
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

  setHours(hours: number): Date {
    var dt = new Date();
    dt.setHours(dt.getHours() + hours);
    return dt;
  }

  setDiffHours(item: data): number {
    console.log('setDiffHours');
    console.log('item.end.getTime() ' + JSON.stringify(item.end.getTime()));
    console.log('item.start.getTime() ' + JSON.stringify(item.start.getTime()));
    console.log('timeDiff ' + JSON.stringify(timeDiff));
    var timeDiff = new Date(item.end.getTime() - item.start.getTime());
    var diffHours = timeDiff.toISOString().substring(11, 12);
    return parseInt(diffHours);
  }
}
