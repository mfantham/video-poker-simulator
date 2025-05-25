import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useSetShowWarning, useShowWarning } from "../../redux/hooks";
import { DealButton } from "../menu/DealButton";
import { MenuButton } from "../menu/MenuButton";

export const SubOptimalWarning = () => {
  const showWarning = useShowWarning();
  const setShowWarning = useSetShowWarning();
  const handleClose = () => setShowWarning(false);

  return (
    <Dialog
      open={showWarning}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        {"This is not the best play"}
      </DialogTitle>
      {/*<DialogContent>*/}
      {/*  <DialogContentText id="alert-dialog-description">*/}
      {/*    Let Google help apps determine location. This means sending anonymous*/}
      {/*    location data to Google, even when no apps are running.*/}
      {/*  </DialogContentText>*/}
      {/*</DialogContent>*/}
      <DialogActions>
        <MenuButton onClick={handleClose}>close</MenuButton>
        <DealButton forceDraw={true} />
      </DialogActions>
    </Dialog>
  );
};
