/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import secretStoreInjectable from "../+secrets/store.injectable";
import namespaceStoreInjectable from "../+namespaces/store.injectable";
import { ReleaseStore } from "./store";

const releaseStoreInjectable = getInjectable({
  instantiate: (di) => new ReleaseStore({
    namespaceStore: di.inject(namespaceStoreInjectable),
    secretStore: di.inject(secretStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default releaseStoreInjectable;
