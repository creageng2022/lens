/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import requestPromise from "request-promise-native";
import type { UserStore } from "./user-store";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { bind } from "./utils";
import userStoreInjectable from "./user-store/store.injectable";

// todo: get rid of "request" (deprecated)
// https://github.com/lensapp/lens/issues/459

interface Dependencies {
  userStore: UserStore;
}

function customRequestPromise({ userStore }: Dependencies, opts: requestPromise.Options) {
  const { httpsProxy, allowUntrustedCAs } = userStore;
  const defaultRequestOps = {
    proxy: httpsProxy || undefined,
    rejectUnauthorized: !allowUntrustedCAs,
  };

  return requestPromise.defaults(defaultRequestOps)(opts);
}

/**
 * @deprecated
 */
const customRequestPromiseInjectable = getInjectable({
  instantiate: (di) => bind(customRequestPromise, null, {
    userStore: di.inject(userStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default customRequestPromiseInjectable;

