import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import type { CardProps as MuiCardProps } from '@mui/material/Card';

export interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ title, subtitle, actions, children, ...props }, ref) => {
    return (
      <MuiCard ref={ref} {...props}>
        {(title || subtitle) && (
          <CardContent>
            {title && (
              <Typography variant="h6" component="h2" gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </CardContent>
        )}
        {children && <CardContent>{children}</CardContent>}
        {actions && <CardActions>{actions}</CardActions>}
      </MuiCard>
    );
  }
);

Card.displayName = 'Card'; 