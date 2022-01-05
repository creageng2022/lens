/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import fileNameMigrationInjectable from "../migrations/user-store/file-name-migration.injectable";
import userStoreMigrationsInjectable from "../migrations/user-store/migrations.injectable";
import { UserStore } from "./user-store";

const userStoreInjectable = getInjectable({
  instantiate: (di) => UserStore.createInstance({
    fileNameMigration: di.inject(fileNameMigrationInjectable),
    migrations: di.inject(userStoreMigrationsInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreInjectable;
