export interface MbDrawerProps {
  modelValue?: boolean;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  width?: number;
  showBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  dismissible?: boolean;
  /** When false, footer (default actions and #footer slot) is not rendered. */
  showFooter?: boolean;
  ariaLabel?: string;
}

export type MbDrawerCloseReason = 'close' | 'escape' | 'backdrop' | 'cancel' | 'primary';

export interface MbDrawerActionPayload {
  reason: MbDrawerCloseReason;
  event: MouseEvent | KeyboardEvent;
}
