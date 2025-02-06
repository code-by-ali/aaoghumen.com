// CustomModal.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Public Sans, serif",
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          width: "410px",
          maxWidth: "410px",
          margin: "12px",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "Public Sans, serif",
          fontSize: "17px",
          fontWeight: 600,
          padding: "10px 16px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "10px 16px",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontFamily: "Public Sans, serif",
          fontSize: "15px",
          color: "#182138",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "14px 16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Public Sans, serif",
          textTransform: "none",
          fontWeight: 700,
        },
      },
    },
  },
});

export const CustomModal = ({
  open,
  onClose,
  title,
  description,
  primaryButtonText,
  secondaryButtonText = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  primaryButtonColor = "primary",
  secondaryButtonColor = "primary",
  maxWidth = "sm",
  fullWidth = false,
  disablePrimaryButton = false,
  disableSecondaryButton = false,
  showSecondaryButton = true,
  children,
}) => {
  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    }
    onClose();
  };

  const handlePrimaryAction = () => {
    onPrimaryAction();
    onClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        aria-labelledby="custom-modal-title"
        aria-describedby="custom-modal-description"
      >
        <DialogTitle id="custom-modal-title">{title}</DialogTitle>
        <DialogContent>
          {description && (
            <DialogContentText id="custom-modal-description">
              {description}
            </DialogContentText>
          )}
          {children}
        </DialogContent>
        <DialogActions>
          {showSecondaryButton && (
            <Button
              size="small"
              onClick={handleSecondaryAction}
              color={secondaryButtonColor}
              disabled={disableSecondaryButton}
            >
              {secondaryButtonText}
            </Button>
          )}
          <Button
            size="small"
            onClick={handlePrimaryAction}
            color={primaryButtonColor}
            disabled={disablePrimaryButton}
            variant="contained"
          >
            {primaryButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
