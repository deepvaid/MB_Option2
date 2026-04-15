export interface MbTabsThemeTokens {
  [token: string]: string;
}

export interface MbTabsTokenBundle {
  light: MbTabsThemeTokens;
  dark: MbTabsThemeTokens;
}

export const mbTabsTokens: MbTabsTokenBundle = {
  light: {
    '--mb-tabs-border-color': 'rgba(16, 32, 51, 0.08)',
    '--mb-tabs-tab-color': '#7d868c',
    '--mb-tabs-active-border-color': '#6bbd5b',
    '--mb-tabs-focus-ring': '0 0 0 3px rgba(107, 189, 91, 0.18)'
  },
  dark: {
    '--mb-tabs-border-color': 'rgba(245, 248, 252, 0.08)',
    '--mb-tabs-tab-color': '#97a3b5',
    '--mb-tabs-active-border-color': '#8ccb78',
    '--mb-tabs-focus-ring': '0 0 0 3px rgba(140, 203, 120, 0.22)'
  }
};
