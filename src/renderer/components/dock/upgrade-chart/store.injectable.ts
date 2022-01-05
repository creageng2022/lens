/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import releaseStoreInjectable from "../../+helm-releases/store.injectable";
import dockStoreInjectable from "../store.injectable";
import upgradeChartStorageInjectable from "./storage.injectable";
import { UpgradeChartStore } from "./store";
import upgradeChartValuesInjectable from "./values.injectable";

const upgradeChartStoreInjectable = getInjectable({
  instantiate: (di) => new UpgradeChartStore({
    upgradeChartValues: di.inject(upgradeChartValuesInjectable),
    releaseStore: di.inject(releaseStoreInjectable),
    storage: di.inject(upgradeChartStorageInjectable),
    dockStore: di.inject(dockStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default upgradeChartStoreInjectable;
