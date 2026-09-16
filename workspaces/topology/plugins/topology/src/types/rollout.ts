/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { V1LabelSelector, V1PodTemplateSpec } from '@kubernetes/client-node';

import { ModelsPlural } from '../models';
import { K8sResourceKind } from './vm';

export const ROLLOUT_TYPE: string = ModelsPlural.rollouts;

export type CanaryStep = {
  setWeight?: number;
  pause?: { duration?: string };
  setCanaryScale?: { weight?: number; replicas?: number };
  analysis?: { templates?: Array<{ templateName: string }> };
  plugin?: { name: string; config?: Record<string, any> };
};

/** Check if a Rollout uses a step plugin for VM (VMIRS) canary */
export const isVMPluginRollout = (steps?: CanaryStep[]): boolean =>
  !!steps?.some(s => s.plugin?.name?.includes('vmirs-canary'));

export type CanaryStrategy = {
  steps?: CanaryStep[];
  maxSurge?: string | number;
  maxUnavailable?: string | number;
  canaryService?: string;
  stableService?: string;
  trafficRouting?: {
    [key: string]: any;
  };
};

export type BlueGreenStrategy = {
  activeService?: string;
  previewService?: string;
  autoPromotionEnabled?: boolean;
  autoPromotionSeconds?: number;
  prePromotionAnalysis?: {
    templates?: Array<{ templateName: string }>;
  };
  postPromotionAnalysis?: {
    templates?: Array<{ templateName: string }>;
  };
};

export type RolloutSpec = {
  replicas?: number;
  selector?: V1LabelSelector;
  template?: V1PodTemplateSpec;
  strategy?: {
    canary?: CanaryStrategy;
    blueGreen?: BlueGreenStrategy;
  };
  minReadySeconds?: number;
  revisionHistoryLimit?: number;
  workloadRef?: {
    apiVersion: string;
    kind: string;
    name: string;
  };
};

export type RolloutStatus = {
  phase?: string;
  message?: string;
  availableReplicas?: number;
  updatedReplicas?: number;
  readyReplicas?: number;
  currentStepIndex?: number;
  stableRS?: string;
  currentPodHash?: string;
  conditions?: Array<{
    type: string;
    status: string;
    reason?: string;
    message?: string;
    lastUpdateTime?: string;
    lastTransitionTime?: string;
  }>;
};

export type RolloutKind = {
  spec: RolloutSpec;
  status: RolloutStatus;
} & K8sResourceKind;
