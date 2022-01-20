/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { userStoreMigrationsInjectionToken } from "../../common/user-store/migrations-injection-token";

const userStoreFileNameMigrationInjectable = getInjectable({
  instantiate: () => undefined,
  injectionToken: userStoreMigrationsInjectionToken,
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreFileNameMigrationInjectable;
