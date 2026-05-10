export interface MbPageHeaderBreadcrumb {
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface MbPageHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  breadcrumbs?: MbPageHeaderBreadcrumb[];
  size?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center';
}
