export interface MbInputFieldThemeTokens {
  [token: string]: string;
}

export interface MbInputFieldTokenBundle {
  light: MbInputFieldThemeTokens;
  dark: MbInputFieldThemeTokens;
}

export const mbInputFieldTokens: MbInputFieldTokenBundle = {
  light: {
    '--mb-if-label-color': '#11181c',
    '--mb-if-bg': '#ffffff',
    '--mb-if-border': '#d7e1ee',
    '--mb-if-border-focus': '#6bbd5b',
    '--mb-if-placeholder-color': '#7d868c',
    '--mb-if-hint-color': '#889096',
    '--mb-if-focus-ring': '0 0 0 3px rgba(107, 189, 91, 0.18)'
  },
  dark: {
    '--mb-if-label-color': '#e5eaf2',
    '--mb-if-bg': '#121923',
    '--mb-if-border': '#405978',
    '--mb-if-border-focus': '#8ccb78',
    '--mb-if-placeholder-color': '#97a3b5',
    '--mb-if-hint-color': '#97a3b5',
    '--mb-if-focus-ring': '0 0 0 3px rgba(140, 203, 120, 0.22)'
  }
};
