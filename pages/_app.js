import './style/globals.css';
import { Analytics } from '@vercel/analytics/next';

export default function MyApp({ Component, pageProps }) {
  // return <html lang="en"><body><Component {...pageProps} /><Analytics /></body></html>;
  return <><Component {...pageProps} /><Analytics /></>;
}