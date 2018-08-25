import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SeparationApplicationService } from "app/entities/separation-application/separation-application.service";
import {
  ISeparationApplication,
  SeparationApplication,
  Status as SeparationApplicationStatus
} from "app/shared/model/separation-application.model";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { JhiAlertService } from "ng-jhipster";
import { IEmployee } from "app/shared/model/employee.model";
import { EmployeeService } from "app/entities/employee";
import { IHrReps } from "app/shared/model/hr-reps.model";
import { HrRepsService } from "app/entities/hr-reps";
import { IFunctionReps } from "app/shared/model/function-reps.model";
import { FunctionRepsService } from "app/entities/function-reps";
import { FormGroup, FormControl } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: "jhi-separation-application-form",
  templateUrl: "./separation-application-form.component.html",
  styleUrls: ["./separation-application-form.component.css"]
})
export class SeparationApplicationFormComponent implements OnInit {
  isSaving = false;
  employeeOptions: IEmployee[];
  hrRepOptions: IHrReps[];
  functionRepOptions: IFunctionReps[];

  // app form group is mimicing the structure of JSON that API generates.
  // conversion functions This way we can acoid writing lengthy.
  public appForm = new FormGroup({
    id: new FormControl(""),
    dateOfLeave: new FormControl(""),
    dateApproved: new FormControl(""),
    location: new FormControl(""),
    employee: new FormGroup({
      id: new FormControl("")
    }),
    fr: new FormGroup({
      id: new FormControl("")
    }),
    hr: new FormControl("")
  });

  constructor(
    private separationApplicationService: SeparationApplicationService,
    private jhiAlertService: JhiAlertService,
    private employeeService: EmployeeService,
    private hrRepsService: HrRepsService,
    private functionRepsService: FunctionRepsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(routeData => {
      this.mapSeparationApplicationToAppForm(routeData.separationApplication);
    });
    this.populateEmployeeOptions();
    this.populateFrOptions();
    this.populateHrOptions();
  }

  mapSeparationApplicationToAppForm(sa: SeparationApplication) {
    // If the record we got here has id, then this record allready exists and we need to populate the form with it
    // If not, then then we just stick empty values that form is initialized with
    const adjustedSa: any = sa;
    // remapping of values because angular material expects default javascript date objects
    if (sa.dateOfLeave) {
      adjustedSa.dateOfLeave = sa.dateOfLeave.toDate();
    }
    if (sa.dateApproved) {
      adjustedSa.dateApproved = sa.dateApproved.toDate();
    }
    this.appForm.patchValue(adjustedSa);
  }

  populateFrOptions() {
    this.functionRepsService.query().subscribe(
      (res: HttpResponse<IFunctionReps[]>) => {
        this.functionRepOptions = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  populateHrOptions() {
    this.hrRepsService.query().subscribe(
      (res: HttpResponse<IHrReps[]>) => {
        this.hrRepOptions = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  populateEmployeeOptions() {
    this.employeeService
      .query({ filter: "separationapplication-is-null" })
      .subscribe((res: HttpResponse<IEmployee[]>) => {
        this.employeeOptions = res.body;
      });
  }

  save() {
    this.isSaving = true;
    const sa: SeparationApplication = this.appForm.getRawValue();
    // we have to convert dates back to momment because that is what jhipster expects
    sa.dateOfLeave = moment(sa.dateOfLeave);
    sa.dateApproved = moment(sa.dateApproved);
    // DEBUG: API demands that we submit these date fields - these values are not correct
    sa.dateSumbitted = moment(sa.dateOfLeave);
    sa.dateCompleted = moment(sa.dateOfLeave);
    sa.status = SeparationApplicationStatus.PENDING;
    if (sa.id !== undefined) {
      this.subscribeToSaveResponse(
        this.separationApplicationService.update(sa)
      );
    } else {
      this.subscribeToSaveResponse(
        this.separationApplicationService.create(sa)
      );
    }
  }

  private onSaveSuccess() {
    this.isSaving = false;
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private subscribeToSaveResponse(
    result: Observable<HttpResponse<ISeparationApplication>>
  ) {
    result.subscribe(
      (res: HttpResponse<ISeparationApplication>) => this.onSaveSuccess(),
      (res: HttpErrorResponse) => this.onSaveError()
    );
  }

  private onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
