/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import getPodsByOwnerIdInjectable from "../../+pods/get-pods-by-owner-id.injectable";
import podsInjectable from "../../+pods/pods.injectable";
import uniqueIdInjectable from "../../../../common/utils/unique-id.injectable";
import closeDockTabInjectable from "../close-tab.injectable";
import createDockTabInjectable from "../create-tab.injectable";
import renameDockTabInjectable from "../rename-tab.injectable";
import logTabStorageInjectable from "./storage.injectable";
import { LogTabStore } from "./store";

const logTabStoreInjectable = getInjectable({
  instantiate: (di) => new LogTabStore({
    getPodsByOwnerId: di.inject(getPodsByOwnerIdInjectable),
    renameDockTab: di.inject(renameDockTabInjectable),
    createDockTab: di.inject(createDockTabInjectable),
    closeDockTab: di.inject(closeDockTabInjectable),
    storage: di.inject(logTabStorageInjectable),
    pods: di.inject(podsInjectable),
    uniqueId: di.inject(uniqueIdInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default logTabStoreInjectable;
