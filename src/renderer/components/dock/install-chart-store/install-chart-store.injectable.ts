/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { InstallChartStore } from "./install-chart.store";
import dockStoreInjectable from "../store.injectable";
import installChartStoreStorageInjectable from "./storage.injectable";
import installChartVersionStoreInjectable from "./version-store.injectable";
import installChartDetailsStoreInjectable from "./details-store.injectable";

const installChartStoreInjectable = getInjectable({
  instantiate: (di) => new InstallChartStore({
    dockStore: di.inject(dockStoreInjectable),
    storage: di.inject(installChartStoreStorageInjectable),
    versionsStore: di.inject(installChartVersionStoreInjectable),
    detailsStore: di.inject(installChartDetailsStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default installChartStoreInjectable;
