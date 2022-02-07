// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { getContainedExternalPackages } from './resource-details-tabs-helpers';

self.onmessage = ({
  data: { selectedResourceId, externalData, resolvedExternalAttributions },
}): void => {
  const output = getContainedExternalPackages({
    selectedResourceId,
    externalData,
    resolvedExternalAttributions,
  });

  self.postMessage({
    output,
  });
};
