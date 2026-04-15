export interface MbTableThemeTokens {
  [token: string]: string;
}

export interface MbTableTokenBundle {
  light: MbTableThemeTokens;
  dark: MbTableThemeTokens;
}

export const mbTableTokens: MbTableTokenBundle = {
  light: {
    '--mb-table-bg': '#ffffff',
    '--mb-table-border': 'rgba(16, 32, 51, 0.08)',
    '--mb-table-text': '#11181c'
  },
  dark: {
    '--mb-table-bg': '#111821',
    '--mb-table-border': 'rgba(245, 248, 252, 0.08)',
    '--mb-table-text': '#e5eaf2'
  }
};
