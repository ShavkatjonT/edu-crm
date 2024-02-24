import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});


const Snackbars = ({ open, onClose, severity, massage }) => {
  // const [transition, setTransition] = React.useState(undefined);
  return (
    <>
      <Snackbar open={open} autoHideDuration={5000} onClose={onClose} sx={{zIndex: '10000000'}} TransitionComponent={SlideTransition}>
        <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
          {massage}
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </>
  );
};

Snackbars.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  severity: PropTypes.string.isRequired,
  massage: PropTypes.string.isRequired,
};

export default Snackbars;
