import "./globals.css";
import {ThemeProvider} from '@mui/material/styles'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import theme from '../src/theme'
import styles from "./page.module.css"

export const metadata = {
  title: 'RegenFrogs',
  description: 'Virtual pet frog',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <link rel="manifest" href="/site.webmanifest"/>
    </head>
    <body className={styles.main}>
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
    </body>
    </html>
  )
}
