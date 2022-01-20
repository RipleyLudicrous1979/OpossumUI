// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import makeStyles from '@mui/styles/makeStyles';
import MuiTypography from '@mui/material/Typography';
import React, { ReactElement, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { PackageInfo } from '../../../shared/shared-types';
import { getTemporaryPackageInfo } from '../../state/selectors/all-views-resource-selectors';
import { AttributionColumn } from '../AttributionColumn/AttributionColumn';
import { ResourcesList } from '../ResourcesList/ResourcesList';
import { setUpdateTemporaryPackageInfoForCreator } from '../ResourceDetailsAttributionColumn/resource-details-attribution-column-helpers';
import { isEqual } from 'lodash';
import {
  deleteAttributionGloballyAndSave,
  savePackageInfo,
  savePackageInfoIfSavingIsNotDisabled,
} from '../../state/actions/resource-actions/save-actions';
import { setTemporaryPackageInfo } from '../../state/actions/resource-actions/all-views-simple-actions';
import {
  getResourceIdsOfSelectedAttribution,
  getResourceIdsOfSelectedExternalAttribution,
  getSelectedAttributionId,
} from '../../state/selectors/attribution-view-resource-selectors';
import { OpossumColors } from '../../shared-styles';
import { useWindowHeight } from '../../util/use-window-height';
import { openPopupWithTargetAttributionId } from '../../state/actions/view-actions/view-actions';
import { PopupType, View } from '../../enums/enums';

const useStyles = makeStyles({
  root: {
    background: OpossumColors.lightestBlue,
    flex: 1,
    display: 'flex',
    padding: 8,
    height: '100%',
  },
  resourceColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    height: '100%',
    paddingRight: 8,
    overflowY: 'auto',
    minWidth: 240,
  },
  typography: {
    marginTop: 8,
  },
});

interface AttributionDetailsViewerProps {
  view: View.Attribution | View.Signal;
}

export function AttributionDetailsViewer(
  props: AttributionDetailsViewerProps
): ReactElement | null {
  const classes = useStyles();

  const selectedAttributionId = useAppSelector(getSelectedAttributionId);
  const temporaryPackageInfo = useAppSelector(getTemporaryPackageInfo);
  const resourceIdsOfSelectedManualAttributionId: Array<string> =
    useAppSelector(getResourceIdsOfSelectedAttribution, isEqual);
  const resourceIdsOfSelectedExternalAttributionId: Array<string> =
    useAppSelector(getResourceIdsOfSelectedExternalAttribution, isEqual);
  const resourceIdsOfSelectedAttributionId: Array<string> =
    props.view === View.Attribution
      ? resourceIdsOfSelectedManualAttributionId
      : resourceIdsOfSelectedExternalAttributionId;

  const resourceListMaxHeight = useWindowHeight() - 112;

  const dispatch = useAppDispatch();

  const saveFileRequestListener = useCallback(() => {
    dispatch(
      savePackageInfoIfSavingIsNotDisabled(
        null,
        selectedAttributionId,
        temporaryPackageInfo
      )
    );
  }, [dispatch, selectedAttributionId, temporaryPackageInfo]);

  const dispatchSavePackageInfo = useCallback(() => {
    dispatch(
      savePackageInfo(null, selectedAttributionId, temporaryPackageInfo)
    );
  }, [dispatch, selectedAttributionId, temporaryPackageInfo]);

  const setUpdateTemporaryPackageInfoFor =
    setUpdateTemporaryPackageInfoForCreator(dispatch, temporaryPackageInfo);

  function deleteAttribution(): void {
    if (temporaryPackageInfo.preSelected) {
      dispatch(deleteAttributionGloballyAndSave(selectedAttributionId));
    } else {
      dispatch(
        openPopupWithTargetAttributionId(
          PopupType.ConfirmDeletionPopup,
          selectedAttributionId
        )
      );
    }
  }

  return selectedAttributionId ? (
    <div className={classes.root}>
      <div className={classes.resourceColumn}>
        <MuiTypography className={classes.typography} variant={'subtitle1'}>
          Linked Resources
        </MuiTypography>
        <ResourcesList
          resourcesListBatches={[
            { resourceIds: resourceIdsOfSelectedAttributionId },
          ]}
          maxHeight={resourceListMaxHeight}
        />
      </div>
      <AttributionColumn
        isEditable={true}
        showManualAttributionData={true}
        areButtonsHidden={false}
        displayPackageInfo={temporaryPackageInfo}
        setUpdateTemporaryPackageInfoFor={setUpdateTemporaryPackageInfoFor}
        onSaveButtonClick={dispatchSavePackageInfo}
        onSaveGloballyButtonClick={(): void => {}}
        onDeleteButtonClick={deleteAttribution}
        onDeleteGloballyButtonClick={(): void => {}}
        setTemporaryPackageInfo={(packageInfo: PackageInfo): void => {
          dispatch(setTemporaryPackageInfo(packageInfo));
        }}
        saveFileRequestListener={saveFileRequestListener}
      />
    </div>
  ) : null;
}
