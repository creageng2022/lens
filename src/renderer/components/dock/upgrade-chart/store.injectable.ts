/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import releasesInjectable from "../../+helm-releases/releases.injectable";
import dockStoreInjectable from "../store.injectable";
import upgradeChartStorageInjectable from "./storage.injectable";
import { UpgradeChartStore } from "./store";
import upgradeChartValuesInjectable from "./values.injectable";

const upgradeChartStoreInjectable = getInjectable({
  instantiate: (di) => new UpgradeChartStore({
    valuesStore: di.inject(upgradeChartValuesInjectable),
    storage: di.inject(upgradeChartStorageInjectable),
    dockStore: di.inject(dockStoreInjectable),
    releases: di.inject(releasesInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default upgradeChartStoreInjectable;
