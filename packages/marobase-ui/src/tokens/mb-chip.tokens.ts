export interface MbChipThemeTokens {
  [token: string]: string;
}

export interface MbChipTokenBundle {
  light: MbChipThemeTokens;
  dark: MbChipThemeTokens;
}

export const mbChipTokens: MbChipTokenBundle = {
  light: {
    '--mb-chip-bg': '#f0f4ee',
    '--mb-chip-text': '#11181c',
    '--mb-chip-focus-ring': '0 0 0 3px rgba(107, 189, 91, 0.18)'
  },
  dark: {
    '--mb-chip-bg': '#1f2a20',
    '--mb-chip-text': '#e5eaf2',
    '--mb-chip-focus-ring': '0 0 0 3px rgba(140, 203, 120, 0.22)'
  }
};
