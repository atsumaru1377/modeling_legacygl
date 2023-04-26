import '../styles/globals.css';
import { SplineFormContextProvider } from '../context/SplineFormContext';

function MyApp({ Component, pageProps }) {
  return (
    <SplineFormContextProvider>
      <Component {...pageProps} />
    </SplineFormContextProvider>
  );
}

export default MyApp;

