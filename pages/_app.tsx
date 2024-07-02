import '../styles/globals.css';
import type { AppProps } from 'next/app';
import WalletConnectProvider from '../components/WalletConnectProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectProvider>
      <Component {...pageProps} />
    </WalletConnectProvider>
  );
}

export default MyApp;
