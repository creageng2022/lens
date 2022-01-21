/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type React from "react";

export interface KubeObjectMenuComponents {
  MenuItem: React.ComponentType<any>;
}

export interface KubeObjectMenuRegistration {
  kind: string;
  apiVersions: string[];
  components: KubeObjectMenuComponents;
}
