/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { observable } from "mobx";
import { jobStore } from "../+workloads-jobs/job.store";
import { podsStore } from "../+workloads-pods/pods.store";
import { Job, Pod } from "../../../common/k8s-api/endpoints";

const runningJob = new Job({
  apiVersion: "foo",
  kind: "Job",
  metadata: {
    name: "runningJob",
    resourceVersion: "runningJob",
    uid: "runningJob",
    namespace: "default",
  },
});

const failedJob = new Job({
  apiVersion: "foo",
  kind: "Job",
  metadata: {
    name: "failedJob",
    resourceVersion: "failedJob",
    uid: "failedJob",
    namespace: "default",
  },
});

const pendingJob = new Job({
  apiVersion: "foo",
  kind: "Job",
  metadata: {
    name: "pendingJob",
    resourceVersion: "pendingJob",
    uid: "pendingJob",
    namespace: "default",
  },
});

const succeededJob = new Job({
  apiVersion: "foo",
  kind: "Job",
  metadata: {
    name: "succeededJob",
    resourceVersion: "succeededJob",
    uid: "succeededJob",
    namespace: "default",
  },
});

const runningPod = new Pod({
  apiVersion: "foo",
  kind: "Pod",
  metadata: {
    name: "foobar",
    resourceVersion: "foobar",
    uid: "foobar",
    ownerReferences: [{
      uid: "runningJob",
    }],
    namespace: "default",
  },
});

runningPod.status = {
  phase: "Running",
  conditions: [
    {
      type: "Initialized",
      status: "True",
      lastProbeTime: 1,
      lastTransitionTime: "1",
    },
    {
      type: "Ready",
      status: "True",
      lastProbeTime: 1,
      lastTransitionTime: "1",
    },
  ],
  hostIP: "10.0.0.1",
  podIP: "10.0.0.1",
  startTime: "now",
  containerStatuses: [],
  initContainerStatuses: [],
};

const pendingPod = new Pod({
  apiVersion: "foo",
  kind: "Pod",
  metadata: {
    name: "foobar-pending",
    resourceVersion: "foobar",
    uid: "foobar-pending",
    ownerReferences: [{
      uid: "pendingJob",
    }],
    namespace: "default",
  },
});

const failedPod = new Pod({
  apiVersion: "foo",
  kind: "Pod",
  metadata: {
    name: "foobar-failed",
    resourceVersion: "foobar",
    uid: "foobar-failed",
    ownerReferences: [{
      uid: "failedJob",
    }],
    namespace: "default",
  },
});

failedPod.status = {
  phase: "Failed",
  conditions: [],
  hostIP: "10.0.0.1",
  podIP: "10.0.0.1",
  startTime: "now",
};

const succeededPod = new Pod({
  apiVersion: "foo",
  kind: "Pod",
  metadata: {
    name: "foobar-succeeded",
    resourceVersion: "foobar",
    uid: "foobar-succeeded",
    ownerReferences: [{
      uid: "succeededJob",
    }],
  },
});

succeededPod.status = {
  phase: "Succeeded",
  conditions: [],
  hostIP: "10.0.0.1",
  podIP: "10.0.0.1",
  startTime: "now",
};

describe("Job Store tests", () => {
  beforeAll(() => {
    podsStore.items = observable.array([
      runningPod,
      failedPod,
      pendingPod,
      succeededPod,
    ]);
  });

  it("gets Job statuses in proper sorting order", () => {
    const statuses = Object.entries(jobStore.getStatuses([
      failedJob,
      succeededJob,
      runningJob,
      pendingJob,
    ]));

    expect(statuses).toEqual([
      ["succeeded", 1],
      ["running", 1],
      ["failed", 1],
      ["pending", 1],
    ]);
  });

  it("returns 0 for other statuses", () => {
    let statuses = Object.entries(jobStore.getStatuses([succeededJob]));

    expect(statuses).toEqual([
      ["succeeded", 1],
      ["running", 0],
      ["failed", 0],
      ["pending", 0],
    ]);

    statuses = Object.entries(jobStore.getStatuses([runningJob]));

    expect(statuses).toEqual([
      ["succeeded", 0],
      ["running", 1],
      ["failed", 0],
      ["pending", 0],
    ]);

    statuses = Object.entries(jobStore.getStatuses([failedJob]));

    expect(statuses).toEqual([
      ["succeeded", 0],
      ["running", 0],
      ["failed", 1],
      ["pending", 0],
    ]);

    statuses = Object.entries(jobStore.getStatuses([pendingJob]));

    expect(statuses).toEqual([
      ["succeeded", 0],
      ["running", 0],
      ["failed", 0],
      ["pending", 1],
    ]);
  });
});
