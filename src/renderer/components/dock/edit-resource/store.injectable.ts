/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import apiManagerInjectable from "../../../../common/k8s-api/api-manager.injectable";
import dockStoreInjectable from "../store.injectable";
import editResourceStorageInjectable from "./storage.injectable";
import { EditResourceStore } from "./store";

const editResourceStoreInjectable = getInjectable({
  instantiate: di => new EditResourceStore({
    apiManager: di.inject(apiManagerInjectable),
    dockStore: di.inject(dockStoreInjectable),
    storage: di.inject(editResourceStorageInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default editResourceStoreInjectable;
