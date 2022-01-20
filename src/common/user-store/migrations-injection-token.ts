/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectionToken } from "@ogre-tools/injectable";
import type { Migrations } from "conf/dist/source/types";
import type { UserStoreModel } from "./store";

export const userStoreMigrationsInjectionToken = getInjectionToken<Migrations<UserStoreModel> | undefined>();
