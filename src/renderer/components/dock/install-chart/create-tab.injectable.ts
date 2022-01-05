/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { HelmChart } from "../../../../common/k8s-api/endpoints/helm-chart.api";
import { bind } from "../../../utils";
import createDockTabInjectable from "../create-tab.injectable";
import { type DockTabCreateSpecific, TabKind, DockTabCreate, DockTabData, TabId } from "../store";
import type { IChartInstallData } from "./store";
import installChartManagerInjectable from "./store.injectable";

interface Dependencies {
  createDockTab: (rawTabDesc: DockTabCreate, addNumber?: boolean) => DockTabData;
  setInstallChartTabData: (tabId: TabId, data: IChartInstallData) => void;
}

function createInstallChartTab({ createDockTab, setInstallChartTabData }: Dependencies, chart: HelmChart, tabParams: DockTabCreateSpecific = {}) {
  const { name, repo, version } = chart;
  const tab = createDockTab({
    title: `Helm Install: ${repo}/${name}`,
    ...tabParams,
    kind: TabKind.INSTALL_CHART,
  }, false);

  setInstallChartTabData(tab.id, {
    name,
    repo,
    version,
    namespace: "default",
    releaseName: "",
    description: "",
  });

  return tab;
}

const newInstallChartTabInjectable = getInjectable({
  instantiate: (di) => bind(createInstallChartTab, null, {
    createDockTab: di.inject(createDockTabInjectable),
    setInstallChartTabData: (di.inject(installChartManagerInjectable)).setData,
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default newInstallChartTabInjectable;
