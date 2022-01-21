/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Kubectl } from "./kubectl";
import directoryForKubectlBinariesInjectable from "./directory-for-kubectl-binaries/directory-for-kubectl-binaries.injectable";
import userPreferencesStoreInjectable from "../../common/user-preferences/store.injectable";

const createKubectlInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies = {
      userStore: di.inject(userPreferencesStoreInjectable),

      directoryForKubectlBinaries: di.inject(
        directoryForKubectlBinariesInjectable,
      ),
    };

    return (clusterVersion: string) =>
      new Kubectl(dependencies, clusterVersion);
  },

  lifecycle: lifecycleEnum.singleton,
});

export default createKubectlInjectable;
