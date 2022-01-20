/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { userStoreFileNameMigrationInjectionToken } from "./file-name-migration-injection-token";
import { userStoreMigrationsInjectionToken } from "./migrations-injection-token";
import { UserStore } from "./store";

const userStoreInjectable = getInjectable({
  instantiate: (di) => new UserStore({
    fileNameMigration: di.inject(userStoreFileNameMigrationInjectionToken),
    migrations: di.inject(userStoreMigrationsInjectionToken),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreInjectable;
