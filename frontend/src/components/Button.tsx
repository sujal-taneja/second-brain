import { ReactElement } from 'react';

const iconSize = {
  sm: 14,
  md: 16,
  lg: 18,
  icon: 16,
};

const variantStyles = {
  primary: 'bg-primary-btn-bg text-primary-btn-text',
  secondary: 'bg-secondary-btn-bg text-secondary-btn-text',
  submitPrimary: 'bg-primary-btn-bg text-primary-btn-text w-full text-sm',
  submitSecondary: 'bg-secondary-btn-bg text-secondary-btn-text w-full text-sm',
  authPrimary: 'bg-heading text-secondary-btn-text text-sm px-6',
  authSecondary: 'text-heading bg-primary-btn-bg text-sm px-6',
  primaryIcon: 'bg-primary-btn-bg text-primary-btn-text',
  secondaryIcon: 'bg-secondary-btn-bg text-secondary-btn-text',
};

const sizeStyles = {
  sm: 'rounded-sm text-sm px-3 py-2 gap-x-2',
  md: 'rounded-md text-md px-4 py-3 gap-x-3',
  lg: 'rounded-lg text-lg px-4 py-4 gap-x-4',
  icon: 'rounded-md text-md px-3 py-3',
};

export interface ButtonProps {
  variant:
    | 'primary'
    | 'secondary'
    | 'submitPrimary'
    | 'submitSecondary'
    | 'authPrimary'
    | 'authSecondary'
    | 'primaryIcon'
    | 'secondaryIcon'
    | 'tertiaryIcon';
  size: 'sm' | 'md' | 'lg' | 'icon';
  text: string;
  startIcon?: (size: number) => ReactElement;
  endIcon?: (size: number) => ReactElement;
  onClick: () => void;
  className?: string;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center ${
        variantStyles[props.variant]
      } ${sizeStyles[props.size]} ${props.className}`}
      onClick={props.onClick}
    >
      {props.startIcon && (
        <div className="flex-shrink-0">
          {props.startIcon(iconSize[props.size])}
        </div>
      )}
      <div className="leading-none">{props.text}</div>
    </button>
  );
}
