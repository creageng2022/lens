/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { joinMigrations } from "../helpers";
import version500alpha0 from "./5.0.0-alpha.0";
import version500alpha2 from "./5.0.0-alpha.2";
import version500Beta10MigrationInjectable from "./5.0.0-beta.10.injectable";
import version500Beta5MigrationInjectable from "./5.0.0-beta.5.injectable";

const hotbarStoreMigrationsInjectable = getInjectable({
  instantiate: (di) => joinMigrations(
    version500alpha0,
    version500alpha2,
    di.inject(version500Beta5MigrationInjectable),
    di.inject(version500Beta10MigrationInjectable),
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default hotbarStoreMigrationsInjectable;
