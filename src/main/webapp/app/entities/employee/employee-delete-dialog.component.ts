import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager } from "ng-jhipster";

import { IEmployee } from "app/shared/model/employee.model";
import { EmployeeService } from "app/entities/employee/employee.service";

@Component({
  selector: "jhi-employee-delete-dialog",
  templateUrl: "./employee-delete-dialog.component.html"
})
export class EmployeeDeleteDialogComponent {
  employee: IEmployee;

  constructor(
    private employeeService: EmployeeService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss("cancel");
  }

  confirmDelete(id: number) {
    this.employeeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: "employeeListModification",
        content: "Deleted an employee"
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: "jhi-employee-delete-popup",
  template: ""
})
export class EmployeeDeletePopupComponent implements OnInit, OnDestroy {
  private ngbModalRef: NgbModalRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ employee }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(
          EmployeeDeleteDialogComponent as Component,
          { size: "lg", backdrop: "static" }
        );
        this.ngbModalRef.componentInstance.employee = employee;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate([{ outlets: { popup: null } }], {
              replaceUrl: true,
              queryParamsHandling: "merge"
            });
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate([{ outlets: { popup: null } }], {
              replaceUrl: true,
              queryParamsHandling: "merge"
            });
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
