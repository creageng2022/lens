/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./workloads.scss";

import React from "react";
import { TabLayout, TabLayoutRoute } from "../layout/tab-layout";
import { WorkloadsOverview } from "../+workloads-overview/overview";
import { Pods } from "../+pods";
import { Deployments } from "../+deployments";
import { DaemonSets } from "../+daemonsets";
import { StatefulSets } from "../+stateful-sets";
import { Jobs } from "../+jobs";
import { CronJobs } from "../+cronjobs";
import { isAllowedResource } from "../../../common/utils/allowed-resource";
import { ReplicaSets } from "../+replica-sets";
import * as routes from "../../../common/routes";

export class Workloads extends React.Component {
  static get tabRoutes(): TabLayoutRoute[] {
    const tabs: TabLayoutRoute[] = [
      {
        title: "Overview",
        component: WorkloadsOverview,
        url: routes.overviewURL(),
        routePath: routes.overviewRoute.path.toString(),
      },
    ];

    if (isAllowedResource("pods")) {
      tabs.push({
        title: "Pods",
        component: Pods,
        url: routes.podsURL(),
        routePath: routes.podsRoute.path.toString(),
      });
    }

    if (isAllowedResource("deployments")) {
      tabs.push({
        title: "Deployments",
        component: Deployments,
        url: routes.deploymentsURL(),
        routePath: routes.deploymentsRoute.path.toString(),
      });
    }

    if (isAllowedResource("daemonsets")) {
      tabs.push({
        title: "DaemonSets",
        component: DaemonSets,
        url: routes.daemonSetsURL(),
        routePath: routes.daemonSetsRoute.path.toString(),
      });
    }

    if (isAllowedResource("statefulsets")) {
      tabs.push({
        title: "StatefulSets",
        component: StatefulSets,
        url: routes.statefulSetsURL(),
        routePath: routes.statefulSetsRoute.path.toString(),
      });
    }

    if (isAllowedResource("replicasets")) {
      tabs.push({
        title: "ReplicaSets",
        component: ReplicaSets,
        url: routes.replicaSetsURL(),
        routePath: routes.replicaSetsRoute.path.toString(),
      });
    }

    if (isAllowedResource("jobs")) {
      tabs.push({
        title: "Jobs",
        component: Jobs,
        url: routes.jobsURL(),
        routePath: routes.jobsRoute.path.toString(),
      });
    }

    if (isAllowedResource("cronjobs")) {
      tabs.push({
        title: "CronJobs",
        component: CronJobs,
        url: routes.cronJobsURL(),
        routePath: routes.cronJobsRoute.path.toString(),
      });
    }

    return tabs;
  }

  render() {
    return (
      <TabLayout className="Workloads" tabs={Workloads.tabRoutes}/>
    );
  }
}
