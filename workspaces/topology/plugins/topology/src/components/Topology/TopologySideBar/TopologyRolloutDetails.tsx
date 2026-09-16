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
import { RolloutKind, isVMPluginRollout } from '../../../types/rollout';
import TopologySideBarDetailsItem from './TopologySideBarDetailsItem';
import TopologyWorkloadDetails from './TopologyWorkloadDetails';

type TopologyRolloutDetailsProps = { rollout: RolloutKind };

const getStrategyType = (rollout: RolloutKind): string => {
  if (rollout.spec?.strategy?.canary) return 'Canary';
  if (rollout.spec?.strategy?.blueGreen) return 'BlueGreen';
  return 'Unknown';
};

const getCurrentStepWeight = (rollout: RolloutKind): number | undefined => {
  const steps = rollout.spec?.strategy?.canary?.steps;
  const currentIndex = rollout.status?.currentStepIndex;
  if (!steps || currentIndex === undefined) return undefined;
  const currentStep = steps[currentIndex];
  return currentStep?.setWeight;
};

const TopologyRolloutDetails = ({ rollout }: TopologyRolloutDetailsProps) => {
  const strategyType = getStrategyType(rollout);
  const steps = rollout.spec?.strategy?.canary?.steps;
  const currentStepIndex = rollout.status?.currentStepIndex;
  const currentWeight = getCurrentStepWeight(rollout);
  const isVMRollout =
    rollout.spec?.workloadRef?.kind === 'VirtualMachineInstanceReplicaSet' ||
    isVMPluginRollout(rollout.spec?.strategy?.canary?.steps);

  return (
    <>
      <div className="topology-workload-details">
        <TopologyWorkloadDetails resource={rollout}>
          <TopologySideBarDetailsItem label="Phase">
            {rollout.status?.phase || 'Unknown'}
          </TopologySideBarDetailsItem>
        </TopologyWorkloadDetails>
      </div>
      <div className="topology-workload-details" data-testid="rollout-details">
        <TopologySideBarDetailsItem label="Strategy">
          {strategyType}
        </TopologySideBarDetailsItem>
        {isVMRollout && (
          <TopologySideBarDetailsItem label="Workload">
            Virtual Machine (VMIRS)
          </TopologySideBarDetailsItem>
        )}
        {steps && currentStepIndex !== undefined && (
          <TopologySideBarDetailsItem label="Current Step">
            {currentStepIndex >= steps.length
              ? 'Completed'
              : `${currentStepIndex + 1} of ${steps.length}`}
          </TopologySideBarDetailsItem>
        )}
        {currentWeight !== undefined && (
          <TopologySideBarDetailsItem label="Canary Weight">
            {`${currentWeight}%`}
          </TopologySideBarDetailsItem>
        )}
        {rollout.status?.stableRS && (
          <TopologySideBarDetailsItem label="Stable RS">
            {rollout.status.stableRS}
          </TopologySideBarDetailsItem>
        )}
        {rollout.status?.currentPodHash && (
          <TopologySideBarDetailsItem label="Canary RS">
            {rollout.status.currentPodHash}
          </TopologySideBarDetailsItem>
        )}
      </div>
    </>
  );
};

export default TopologyRolloutDetails;
