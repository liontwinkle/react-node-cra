import React from 'react';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  panel: {
    '& > .MuiExpansionPanelSummary-root': {
      background: '#ddd',
    },
  },
  subPanel: {
    '& > .MuiExpansionPanelSummary-root': {
      borderBottom: '1px solid #ddd',
    },
  },
}));

const MuiTheme = createMuiTheme({
  overrides: {
    MuiExpansionPanelDetails: {
      root: {
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
});

function CustomAccordion() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={MuiTheme}>
      <ExpansionPanel className={classes.panel}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Refine</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ExpansionPanel className={classes.subPanel}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Expansion Panel 2</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Expansion Panel 3</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </ThemeProvider>
  );
}

export default CustomAccordion;
