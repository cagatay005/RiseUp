import { AppText, type AppTextProps } from './AppText';

export interface HeadingProps extends Omit<AppTextProps, 'variant'> {
  variant?: 'h1' | 'h2' | 'quote';
}

export function Heading({ variant = 'h1', ...rest }: HeadingProps) {
  return <AppText variant={variant} {...rest} />;
}
