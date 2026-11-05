import './styles.css';
export const metadata = { title: 'DevOps Assessment Demo', description: 'Full-stack async job processing demo' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
