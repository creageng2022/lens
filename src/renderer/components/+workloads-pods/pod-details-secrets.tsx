/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./pod-details-secrets.scss";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { autorun, observable, makeObservable } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import { Pod, Secret, secretsApi } from "../../../common/k8s-api/endpoints";
import { getDetailsUrl } from "../kube-detail-params";

interface Props {
  pod: Pod;
}

@observer
export class PodDetailsSecrets extends Component<Props> {
  @observable secrets = observable.map<string, Secret>();

  @disposeOnUnmount
  secretsLoader = autorun(async () => {
    const { pod } = this.props;

    const secrets = (await Promise.all(
      pod.getSecrets().map(secretName => secretsApi.get({
        name: secretName,
        namespace: pod.getNs(),
      })),
    )).filter(Boolean);

    this.secrets.replace(secrets.map(secret => [secret.getName(), secret]));
  });

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { pod } = this.props;

    return (
      <div className="PodDetailsSecrets">
        {pod.getSecrets().map(this.renderSecret)}
      </div>
    );
  }

  protected renderSecret = (name: string) => {
    const secret = this.secrets.get(name);

    if (!secret) {
      return <span key={name}>{name}</span>;
    }

    return (
      <Link key={secret.getId()} to={getDetailsUrl(secret.selfLink)}>
        {secret.getName()}
      </Link>
    );
  };
}
