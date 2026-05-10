export interface MbModalProps {
  modelValue?: boolean;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  dismissible?: boolean;
  closeOnOverlay?: boolean;
  closeOnAction?: boolean;
  width?: number;
  ariaLabel?: string;
  tone?: 'default' | 'danger';
}

export type MbModalCloseReason = 'close' | 'escape' | 'overlay' | 'primary' | 'secondary';

export interface MbModalActionPayload {
  reason: MbModalCloseReason;
  event: MouseEvent | KeyboardEvent;
}
