import { AppProps } from 'next/app';
import { UserContextProvider } from './userContext';
import './globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserContextProvider>
            <Component {...pageProps} />
        </UserContextProvider>
    );
}

export default MyApp;
