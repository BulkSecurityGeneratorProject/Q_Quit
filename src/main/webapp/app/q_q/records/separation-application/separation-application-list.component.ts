import { Component, OnInit } from "@angular/core";
import { SeparationApplicationService } from "app/entities/separation-application/separation-application.service";
import { ISeparationApplication } from "app/shared/model/separation-application.model";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";

@Component({
  selector: "jhi-separation-application-list",
  templateUrl: "./separation-application-list.component.html",
  styleUrls: ["./separation-application-list.component.css"]
})
export class SeparationApplicationListComponent implements OnInit {
  separationApplications: ISeparationApplication[];

  mode = "determinate";
  value = 66;

  constructor(
    private separationApplicationService: SeparationApplicationService
  ) {}

  loadAll() {
    this.separationApplicationService.query().subscribe(
      (res: HttpResponse<ISeparationApplication[]>) => {
        this.separationApplications = res.body;
      },
      (res: HttpErrorResponse) => console.log(res.message)
    );
  }

  ngOnInit() {
    this.loadAll();
  }
}
