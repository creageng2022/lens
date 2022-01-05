/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { joinMigrations } from "../helpers";
import version210Beta4 from "./2.1.0-beta.4";
import version500Alpha3 from "./5.0.0-alpha.3";
import version503Beta1Injecable from "./5.0.3-beta.1.injectable.ts";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";

const userStoreMigrationsInjectable = getInjectable({
  instantiate: (di) => joinMigrations(
    version210Beta4,
    version500Alpha3,
    di.inject(version503Beta1Injecable),
  ),
  lifecycle: lifecycleEnum.singleton,
});

export default userStoreMigrationsInjectable;
