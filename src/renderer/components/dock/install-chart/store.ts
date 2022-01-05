/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action } from "mobx";
import type { TabId } from "../store";
import { DockTabStorageLayer, DockTabStore, DockTabStoreDependencies } from "../dock-tab/store";
import { getChartDetails, getChartValues } from "../../../../common/k8s-api/endpoints/helm-chart.api";

export interface IChartInstallData {
  name: string;
  repo: string;
  version: string;
  values?: string;
  releaseName?: string;
  description?: string;
  namespace?: string;
  lastVersion?: boolean;
}

export interface InstallChartStoreDependencies extends DockTabStoreDependencies<IChartInstallData> {
  chartVersionManager: DockTabStorageLayer<string[]>;
}

export interface InstallChartManager extends DockTabStorageLayer<IChartInstallData> {
  loadValues: (tabId: TabId) => Promise<void>;
  initialLoad: (tabId: TabId) => Promise<void>;
}

export class InstallChartStore extends DockTabStore<IChartInstallData> implements InstallChartManager {
  constructor(protected readonly dependencies: InstallChartStoreDependencies) {
    super(dependencies);
  }

  initialLoad = action(async (tabId: string) => {
    const promises = [];

    if (!this.getData(tabId).values) {
      promises.push(this.loadValues(tabId));
    }

    if (!this.dependencies.chartVersionManager.getData(tabId)) {
      promises.push(this.loadVersions(tabId));
    }

    await Promise.all(promises);
  });

  protected loadVersions = action(async (tabId: TabId) =>{
    const { repo, name, version } = this.getData(tabId);

    this.dependencies.chartVersionManager.clearData(tabId); // reset
    const charts = await getChartDetails(repo, name, { version });
    const versions = charts.versions.map(chartVersion => chartVersion.version);

    this.dependencies.chartVersionManager.setData(tabId, versions);
  });

  loadValues = action(async (tabId: TabId): Promise<void> =>{
    for (let i = 0; i < 4; i += 1) {
      const data = this.getData(tabId);
      const { repo, name, version } = data;
      const values = await getChartValues(repo, name, version);

      if (values) {
        this.setData(tabId, { ...data, values });
      }
    }
  });
}
