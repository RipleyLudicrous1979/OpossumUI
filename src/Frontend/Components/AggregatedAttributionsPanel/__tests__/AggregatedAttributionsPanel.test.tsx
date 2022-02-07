// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { screen } from '@testing-library/react';
import React from 'react';
import {
  Attributions,
  Resources,
  ResourcesToAttributions,
} from '../../../../shared/shared-types';
import { ButtonText } from '../../../enums/enums';
import {
  createTestAppStore,
  renderComponentWithStore,
} from '../../../test-helpers/render-component-with-store';
import { getParsedInputFileEnrichedWithTestData } from '../../../test-helpers/general-test-helpers';
import { AggregatedAttributionsPanel } from '../AggregatedAttributionsPanel';
import { loadFromFile } from '../../../state/actions/resource-actions/load-actions';
import { expectPackageInPackagePanel } from '../../../test-helpers/package-panel-helpers';
import {
  clickOnButtonInPackageContextMenu,
  expectButtonInPackageContextMenu,
  expectGlobalOnlyContextMenuForNotPreselectedAttribution,
  testCorrectMarkAndUnmarkForReplacementInContextMenu,
} from '../../../test-helpers/context-menu-test-helpers';
import {
  getNewContainedExternalAttributionsAccordionWorker,
  getNewContainedManualAttributionsAccordionWorker,
  ResourceDetailsTabsWorkers,
} from '../../ResourceDetailsTabs/get-new-accordion-worker';
import { setSelectedResourceId } from '../../../state/actions/resource-actions/audit-view-simple-actions';

const mockResourceDetailsTabsWorkers: ResourceDetailsTabsWorkers = {
  containedExternalAttributionsAccordionWorker:
    getNewContainedExternalAttributionsAccordionWorker(),
  containedManualAttributionsAccordionWorker:
    getNewContainedManualAttributionsAccordionWorker(),
};

describe('The AggregatedAttributionsPanel', () => {
  test('renders', () => {
    const testResources: Resources = { file: 1 };

    const testManualAttributions: Attributions = {
      uuid1: {
        packageName: 'React',
        packageVersion: '16.5.0',
      },
      uuid2: {
        packageName: 'JQuery',
      },
      uuid3: {
        packageVersion: '16',
      },
    };
    const testResourcesToManualAttributions: ResourcesToAttributions = {
      '/file': ['uuid1', 'uuid2', 'uuid3'],
    };

    const testExternalAttributions: Attributions = {
      uuid1: {
        packageName: 'React',
        packageVersion: '17.0.0',
      },
    };
    const testResourcesToExternalAttributions: ResourcesToAttributions = {
      '/file': ['uuid1'],
    };

    const testStore = createTestAppStore();
    testStore.dispatch(
      loadFromFile(
        getParsedInputFileEnrichedWithTestData({
          resources: testResources,
          manualAttributions: testManualAttributions,
          resourcesToManualAttributions: testResourcesToManualAttributions,
          externalAttributions: testExternalAttributions,
          resourcesToExternalAttributions: testResourcesToExternalAttributions,
        })
      )
    );
    testStore.dispatch(setSelectedResourceId('/'));

    renderComponentWithStore(
      <AggregatedAttributionsPanel
        isAddToPackageEnabled={true}
        resourceDetailsTabsWorkers={mockResourceDetailsTabsWorkers}
      />,
      { store: testStore }
    );

    expectPackageInPackagePanel(
      screen,
      'React, 16.5.0',
      'Attributions in Folder Content'
    );
    expectPackageInPackagePanel(
      screen,
      'JQuery',
      'Attributions in Folder Content'
    );
    expectPackageInPackagePanel(
      screen,
      'React, 17.0.0',
      'Signals in Folder Content'
    );
  });

  test('shows correct replace attribution buttons in the context menu', () => {
    const testResources: Resources = {
      root: { src: { file_1: 1, file_2: 1 } },
      file: 1,
    };
    const testManualAttributions: Attributions = {
      uuid_1: {
        packageName: 'jQuery',
        packageVersion: '16.0.0',
        comment: 'ManualPackage',
      },
      uuid_2: {
        packageName: 'React',
        packageVersion: '16.0.0',
        comment: 'ManualPackage',
      },
      uuid_3: {
        packageName: 'Vue',
        packageVersion: '16.0.0',
        comment: 'ManualPackage',
        preSelected: true,
      },
    };
    const testResourcesToManualAttributions: ResourcesToAttributions = {
      '/root/src/file_1': ['uuid_1'],
      '/root/src/file_2': ['uuid_2', 'uuid_3'],
    };

    const testStore = createTestAppStore();
    testStore.dispatch(
      loadFromFile(
        getParsedInputFileEnrichedWithTestData({
          resources: testResources,
          manualAttributions: testManualAttributions,
          resourcesToManualAttributions: testResourcesToManualAttributions,
        })
      )
    );
    testStore.dispatch(setSelectedResourceId('/root/src/'));

    renderComponentWithStore(
      <AggregatedAttributionsPanel
        isAddToPackageEnabled={true}
        resourceDetailsTabsWorkers={mockResourceDetailsTabsWorkers}
      />,
      { store: testStore }
    );

    expectGlobalOnlyContextMenuForNotPreselectedAttribution(
      screen,
      'jQuery, 16.0.0'
    );

    testCorrectMarkAndUnmarkForReplacementInContextMenu(
      screen,
      'jQuery, 16.0.0'
    );

    clickOnButtonInPackageContextMenu(
      screen,
      'jQuery, 16.0.0',
      ButtonText.MarkForReplacement
    );

    expectButtonInPackageContextMenu(
      screen,
      'Vue, 16.0.0',
      ButtonText.ReplaceMarked
    );

    expectGlobalOnlyContextMenuForNotPreselectedAttribution(
      screen,
      'React, 16.0.0',
      true
    );
  });
});
