/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { EventEmitter } from "../event-emitter";

export type AppEvent = {
  name: string;
  action: string;
  params?: object;
};

export const appEventBus = new EventEmitter<[AppEvent]>();
