/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ClusterFrameHandler } from "./cluster-frame-handler";

const clusterFrameHandlerInjectable = getInjectable({
  instantiate: () => new ClusterFrameHandler(),
  lifecycle: lifecycleEnum.singleton,
});

export default clusterFrameHandlerInjectable;
