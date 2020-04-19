import { Component, ViewChild, AfterViewInit, TemplateRef, ElementRef, ChangeDetectorRef } from "@angular/core";
import { TimesheetService } from "./timesheet.service";
import { CsvDataService } from "./CsvData.service";
import { NgbDateStruct, NgbTimeStruct, NgbModal, NgbTimepicker, NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { data } from "./data.model";
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
  providers: [
    TimesheetService,
    CsvDataService
  ]
})
export class TimesheetComponent implements AfterViewInit {

  @ViewChild('timesheettable', { static: true }) timesheetTable: ElementRef;
  @ViewChild('csvReader', { static: true }) csvReader: any;
  @ViewChild("d1", { static: true }) d1: NgbDatepicker;
  @ViewChild("t1", { static: true }) t1: NgbTimepicker;

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  startDate: NgbDateStruct;
  events: Array<data> = [];
  value: data;
  dataToSet: data;

  constructor(private ds: TimesheetService, private csvService: CsvDataService, private modalService: NgbModal, private cdRef: ChangeDetectorRef) {
    this.minDate = { year: 2020, month: 4, day: 1 };
    this.maxDate = { year: 2021, month: 1, day: 1 };
    let dateNow = new Date();
    this.startDate = { year: dateNow.getFullYear(), month: dateNow.getMonth(), day: dateNow.getDay() };
  }

  ngAfterViewInit(): void {
    this.ds.getEvents().subscribe(result => {
      this.events = result;
      console.log(JSON.stringify(this.events));
    });
  }
  
  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.csvService.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.csvService.getHeaderArray(csvRecordsArray);
        this.csvService.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);

      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  saveCsv() {
    this.csvService.exportToCsv('test.csv', this.events);
  }

  toTimeStartModel(time: NgbTimeStruct, index: number): void 
  {
    this.events[index].timeStartFormat = time;
    this.events[index].start = new Date(
      this.events[index].date.getUTCFullYear(),
      this.events[index].date.getUTCMonth(),
      this.events[index].date.getUTCDay(),
      time.hour,
      time.minute,
      time.second
    );
    this.cdRef.detectChanges();
  }

  toTimeEndModel(time: NgbTimeStruct, index: number): void {
    this.events[index].timeEndFormat = time;
    this.events[index].end = new Date(
      this.events[index].date.getUTCFullYear(),
      this.events[index].date.getUTCMonth(),
      this.events[index].date.getUTCDay(),
      time.hour,
      time.minute,
      time.second
    );
    this.cdRef.detectChanges();
  }

  toDateModel(date: NgbDateStruct, index:number): void 
  {

    this.events[index].date = new Date(date.year, date.month - 1, date.day);
    this.events[index].dateFormat = date;
    this.cdRef.detectChanges();
  }
  fileReset() {
    this.events = [];
  }

  Delete(item) {
    this.value = null;
    console.log('Detete ITem ' + JSON.stringify(item));
    this.events = this.events.filter(function (obj) {
      return obj.id !== item.id;
    });
    this.cdRef.detectChanges();
  }

  CheckTime(item: data) {
    console.log('check item : ' + JSON.stringify(item));
    this.value = JSON.parse(JSON.stringify(item));
    let index = this.events.findIndex(ev => ev.id === item.id);
    this.events[index].end = new Date();
    this.events[index].timeEndFormat = this.ds.fromTimeModel(new Date());
    this.events[index].totalHours = this.ds.setDiffHours(item)
    this.cdRef.detectChanges();

  }

  EditItem(item: data) {
    this.value = JSON.parse(JSON.stringify(item));

    this.cdRef.detectChanges();
    
  }

  newItem() {
    //this.value = null;
    console.log('New ITem ');
    console.log(JSON.stringify(this.events));

    let newId = (++this.events.length);
    let today = new Date();

    this.events.push(
      {
        id: newId,
        date: today,
        start: today,
        end: null,
        totalHours: 0,
        text: "Record " + newId,
        dateFormat: this.ds.fromDateModel(today),
        timeStartFormat: this.ds.fromTimeModel(new Date()),
        timeEndFormat: { hour: 0, minute: 0, second: 0 }
      });
    console.log(JSON.stringify(this.events));
    this.events = this.events.filter((x) => x !== null);
    this.cdRef.detectChanges();
  }


  downloadCSV() {

  }
}


