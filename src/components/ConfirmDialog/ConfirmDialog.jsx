import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Natijalarni sms xabarnoma shaklida yuborish</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Rostdan ham DTM da qatnashgan o&apos;quvchilar natijalarini sms xabarnoma shaklida yubormoqchimisiz?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Bekor qilish
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          onClose = {() => {
               onClose();
          }}
          color="primary"
        >
          Yuborish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
