/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { HelmRelease } from "../../../../common/k8s-api/endpoints/helm-release.api";
import { bind } from "../../../utils";
import { type DockTabCreateSpecific, TabKind, DockStore } from "../store";
import dockStoreInjectable from "../store.injectable";
import type { UpgradeChartStore } from "./store";
import upgradeChartStoreInjectable from "./store.injectable";

interface Dependencies {
  upgradeChartStore: UpgradeChartStore;
  dockStore: DockStore;
}

function createUpgradeChartTab({ upgradeChartStore, dockStore }: Dependencies, release: HelmRelease, tabParams: DockTabCreateSpecific = {}) {
  let tab = upgradeChartStore.getTabByRelease(release.getName());

  if (tab) {
    dockStore.open();
    dockStore.selectTab(tab.id);
  }

  if (!tab) {
    tab = dockStore.createTab({
      title: `Helm Upgrade: ${release.getName()}`,
      ...tabParams,
      kind: TabKind.UPGRADE_CHART,
    }, false);

    upgradeChartStore.setData(tab.id, {
      releaseName: release.getName(),
      releaseNamespace: release.getNs(),
    });
  }

  return tab;
}

const newUpgradeChartTabInjectable = getInjectable({
  instantiate: (di) => bind(createUpgradeChartTab, null, {
    dockStore: di.inject(dockStoreInjectable),
    upgradeChartStore: di.inject(upgradeChartStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default newUpgradeChartTabInjectable;
