/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import path from "path";
import { helmCli } from "../../helm/helm-cli";
import { ShellSession, ShellSessionDependencies } from "../shell-session";
import type { IComputedValue } from "mobx";
import type { Kubectl } from "../../kubectl/kubectl";
import type { Cluster } from "../../../common/cluster/cluster";
import type WebSocket from "ws";

export interface LocalShellSessionDependencies extends ShellSessionDependencies {
  readonly kubectlBinariesPath: IComputedValue<string>;
  readonly downloadKubectlBinaries: IComputedValue<boolean>;
}

export class LocalShellSession extends ShellSession {
  ShellType = "shell";

  constructor(kubectl: Kubectl, websocket: WebSocket, cluster: Cluster, terminalId: string, protected readonly dependencies: LocalShellSessionDependencies) {
    super(kubectl, websocket, cluster, terminalId, dependencies);
  }

  protected getPathEntries(): string[] {
    return [helmCli.getBinaryDir()];
  }

  protected get cwd(): string | undefined {
    return this.cluster.preferences?.terminalCWD;
  }

  public async open() {
    const env = await this.getCachedShellEnv();
    const shell = env.PTYSHELL;
    const args = await this.getShellArgs(shell);

    await this.openShellProcess(env.PTYSHELL, args, env);
  }

  protected async getShellArgs(shell: string): Promise<string[]> {
    const helmpath = helmCli.getBinaryDir();
    const pathFromPreferences = this.dependencies.kubectlBinariesPath.get() || this.kubectl.getBundledPath();
    const kubectlPathDir = this.dependencies.downloadKubectlBinaries.get()
      ? await this.kubectlBinDirP
      : path.dirname(pathFromPreferences);

    switch(path.basename(shell)) {
      case "powershell.exe":
        return ["-NoExit", "-command", `& {$Env:PATH="${helmpath};${kubectlPathDir};$Env:PATH"}`];
      case "bash":
        return ["--init-file", path.join(await this.kubectlBinDirP, ".bash_set_path")];
      case "fish":
        return ["--login", "--init-command", `export PATH="${helmpath}:${kubectlPathDir}:$PATH"; export KUBECONFIG="${await this.kubeconfigPathP}"`];
      case "zsh":
        return ["--login"];
      default:
        return [];
    }
  }
}
