/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import userStoreInjectable from "../../common/user-store/store.injectable";
import { asLegacyGlobalObjectForExtensionApi } from "../as-legacy-globals-for-extension-api/as-legacy-global-object-for-extension-api";

const userStore = asLegacyGlobalObjectForExtensionApi(userStoreInjectable);

/**
 * Get the configured kubectl binaries path.
 */
export function getKubectlPath(): string | undefined {
  return userStore.kubectlBinariesPath;
}
