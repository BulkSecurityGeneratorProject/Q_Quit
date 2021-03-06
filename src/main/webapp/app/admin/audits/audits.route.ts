import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route
} from "@angular/router";
import { JhiPaginationUtil, JhiResolvePagingParams } from "ng-jhipster";

import { AuditsComponent } from "app/admin/audits/audits.component";

export const auditsRoute: Route = {
  path: "audits",
  component: AuditsComponent,
  resolve: {
    pagingParams: JhiResolvePagingParams
  },
  data: {
    pageTitle: "Audits",
    defaulSort: "auditEventDate,desc"
  }
};
