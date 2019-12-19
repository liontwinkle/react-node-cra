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
    border: 'none',
    boxShadow: 'none',
    '& > .MuiExpansionPanelSummary-root': {
      borderBottom: '1px solid #ddd',
    },
  },
  subAttribute: {
    display: 'flex',
    flexDirection: 'column',
    '& > .MuiExpansionPanelDetails-root': {
      padding: '8px 24px 8px',
    },
    '& > p': {
      cursor: 'pointer',
      '&:hover': {
        color: '#ddd',
      },
    },
  },
  active: {
    color: 'blue',
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
              <Typography>Size</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.subAttribute}>
              <Typography className={classes.active}>1x</Typography>
              <Typography>2x</Typography>
              <Typography>3x</Typography>
              <Typography>4x</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel className={classes.subPanel}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Color</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.subAttribute}>
              <Typography>Black</Typography>
              <Typography>White</Typography>
              <Typography>Blue</Typography>
              <Typography>Green</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </ThemeProvider>
  );
}

export default CustomAccordion;
