import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes
} from "@angular/router";
import { UserRouteAccessService } from "app/core";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { Action } from "app/shared/model/action.model";
import { ActionService } from "app/entities/action/action.service";
import { ActionComponent } from "app/entities/action/action.component";
import { ActionDetailComponent } from "app/entities/action/action-detail.component";
import { ActionUpdateComponent } from "app/entities/action/action-update.component";
import { ActionDeletePopupComponent } from "app/entities/action/action-delete-dialog.component";
import { IAction } from "app/shared/model/action.model";

@Injectable({ providedIn: "root" })
export class ActionResolve implements Resolve<IAction> {
  constructor(private service: ActionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.params["id"] ? route.params["id"] : null;
    if (id) {
      return this.service
        .find(id)
        .pipe(map((action: HttpResponse<Action>) => action.body));
    }
    return of(new Action());
  }
}

export const actionRoute: Routes = [
  {
    path: "action",
    component: ActionComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "Actions"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: "action/:id/view",
    component: ActionDetailComponent,
    resolve: {
      action: ActionResolve
    },
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "Actions"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: "action/new",
    component: ActionUpdateComponent,
    resolve: {
      action: ActionResolve
    },
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "Actions"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: "action/:id/edit",
    component: ActionUpdateComponent,
    resolve: {
      action: ActionResolve
    },
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "Actions"
    },
    canActivate: [UserRouteAccessService]
  }
];

export const actionPopupRoute: Routes = [
  {
    path: "action/:id/delete",
    component: ActionDeletePopupComponent,
    resolve: {
      action: ActionResolve
    },
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "Actions"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  }
];
