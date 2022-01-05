/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { UserStore } from "../../../common/user-store";

const localeTimezoneInjectable = getInjectable({
  instantiate: () => UserStore.getInstance().localeTimezone,
  lifecycle: lifecycleEnum.singleton,
});

export default localeTimezoneInjectable;
