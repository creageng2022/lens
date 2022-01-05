/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import dockStoreInjectable from "../store.injectable";
import logTabStoreInjectable from "../log-tab/store.injectable";
import { LogsStore } from "./store";
import podApiInjectable from "../../../../common/k8s-api/endpoints/pod.api.injectable";

const logsStoreInjectable = getInjectable({
  instantiate: (di) => new LogsStore({
    dockStore: di.inject(dockStoreInjectable),
    logTabStore: di.inject(logTabStoreInjectable),
    podApi: di.inject(podApiInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default logsStoreInjectable;
