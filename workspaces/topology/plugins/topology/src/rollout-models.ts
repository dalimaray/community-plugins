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
import { GroupVersionKind, Model } from './types/types';

export const RolloutGVK: GroupVersionKind = {
  apiVersion: 'v1alpha1',
  apiGroup: 'argoproj.io',
  kind: 'Rollout',
};

export const AnalysisRunGVK: GroupVersionKind = {
  apiVersion: 'v1alpha1',
  apiGroup: 'argoproj.io',
  kind: 'AnalysisRun',
};

export const RolloutModel: Model = {
  ...RolloutGVK,
  abbr: 'RO',
  labelPlural: 'Rollouts',
  color: '#e96d28',
  plural: 'rollouts',
};

export const AnalysisRunModel: Model = {
  ...AnalysisRunGVK,
  abbr: 'AR',
  labelPlural: 'AnalysisRuns',
  color: '#e96d28',
  plural: 'analysisruns',
};
