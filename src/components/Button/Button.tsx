import { Button as MuiButton } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import React from 'react';

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = false, icon, children, disabled, ...props }, ref) => {
    return (
      <MuiButton
        ref={ref}
        disabled={disabled || loading}
        startIcon={loading ? undefined : icon}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
