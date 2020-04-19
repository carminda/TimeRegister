import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbDateStruct, NgbModal, NgbTimepicker, NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { TimesheetService } from './timesheet/timesheet.service';
import { CsvDataService } from './timesheet/CsvData.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    TimesheetComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  providers: [TimesheetService, CsvDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
