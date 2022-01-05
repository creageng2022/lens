/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import chartVersionManagerInjectable from "./chart-version-manager.injectable";
import installChartStorageInjectable from "./storage.injectable";
import { InstallChartStore } from "./store";

const installChartManagerInjectable = getInjectable({
  instantiate: (di) => new InstallChartStore({
    chartVersionManager: di.inject(chartVersionManagerInjectable),
    storage: di.inject(installChartStorageInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default installChartManagerInjectable;
