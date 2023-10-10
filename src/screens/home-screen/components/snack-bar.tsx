import React from 'react';
import {Snackbar} from 'react-native-paper';
/**
 * @param isVisible to decide to open snackbar or not
 * @param actionLabel label for action button on snackbar
 * @param message message to show on snackbar
 * @function onDismiss on dismiss of snackbar 
 * @function onAction on click of action button
 */
const SnackBar: React.FC<ISnackBar> = React.memo(
  ({isVisible, actionLabel, message, onDismiss, onAction}) => {
    return (
      <Snackbar
        visible={isVisible}
        duration={3000}
        onDismiss={onDismiss}
        action={{
          label: actionLabel,
          onPress: onAction,
        }}>
        {message}
      </Snackbar>
    );
  },
  (prevProps: Readonly<ISnackBar>, nextProps: Readonly<ISnackBar>) => {
    return prevProps.isVisible == nextProps.isVisible;
  },
);

export default SnackBar;
