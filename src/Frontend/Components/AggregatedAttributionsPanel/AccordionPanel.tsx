// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import makeStyles from '@mui/styles/makeStyles';
import MuiTypography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import React, { ReactElement, useMemo } from 'react';
import { AttributionIdWithCount } from '../../../shared/shared-types';
import { PackagePanel } from '../PackagePanel/PackagePanel';
import { PanelData } from '../ResourceDetailsTabs/resource-details-tabs-helpers';

const useStyles = makeStyles({
  expansionPanelExpanded: {
    margin: '0px !important',
  },
  expansionPanelSummary: {
    minHeight: '24px !important',
    '& div.MuiAccordionSummary-content': {
      margin: 0,
    },
    '& div.MuiAccordionSummary-expandIcon': {
      padding: '6px 12px',
    },
    padding: '0 12px',
  },
  disabledAccordion: {},
  expansionPanelDetails: { height: '100%', padding: '0 0 16px 12px ' },
});

interface AccordionPanelProps {
  panelData: PanelData;
  isAddToPackageEnabled: boolean;
}

export function AccordionPanel(props: AccordionPanelProps): ReactElement {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState<boolean>(false);

  useMemo(() => {
    setExpanded(Boolean(props.panelData.attributionIdsWithCount?.length > 0));
  }, [props.panelData.attributionIdsWithCount]);

  function handleExpansionChange(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: React.ChangeEvent<unknown>,
    targetExpansionState: boolean
  ): void {
    setExpanded(targetExpansionState);
  }

  return (
    <MuiAccordion
      className={clsx(
        isDisabled(props.panelData.attributionIdsWithCount)
          ? classes.disabledAccordion
          : null
      )}
      classes={{ expanded: classes.expansionPanelExpanded }}
      elevation={0}
      square={true}
      key={`PackagePanel-${props.panelData.title}`}
      expanded={expanded}
      onChange={handleExpansionChange}
      disabled={isDisabled(props.panelData.attributionIdsWithCount)}
    >
      <MuiAccordionSummary
        classes={{ root: classes.expansionPanelSummary }}
        expandIcon={<ExpandMoreIcon />}
      >
        <MuiTypography>{props.panelData.title}</MuiTypography>
      </MuiAccordionSummary>
      <MuiAccordionDetails classes={{ root: classes.expansionPanelDetails }}>
        <PackagePanel
          title={props.panelData.title}
          attributionIdsWithCount={props.panelData.attributionIdsWithCount}
          attributions={props.panelData.attributions}
          isAddToPackageEnabled={props.isAddToPackageEnabled}
        />
      </MuiAccordionDetails>
    </MuiAccordion>
  );
}

function isDisabled(
  attributionIdsWithCount: Array<AttributionIdWithCount>
): boolean {
  return (
    attributionIdsWithCount === undefined ||
    (attributionIdsWithCount && attributionIdsWithCount?.length === 0)
  );
}
