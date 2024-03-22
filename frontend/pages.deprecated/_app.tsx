import "../styles/globals.css";
import type {AppProps} from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeContextProvider} from "../styles/theme";
import {useApollo} from "../lib/apollo-client";
import {ApolloProvider} from "@apollo/client";
import {ProfileProvider} from "../components/Auth/ProfileProvider";
import {SnackbarProvider} from "notistack";

export default function App({Component, pageProps}: AppProps) {
  const apolloClient = useApollo(
    typeof pageProps.initialApolloState === "string"
      ? JSON.parse(pageProps.initialApolloState)
      : pageProps.initialApolloState
  );

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeContextProvider>
          <SnackbarProvider maxSnack={3}>
            <ProfileProvider>
              <CssBaseline/>
              <Component {...pageProps} />
            </ProfileProvider>
          </SnackbarProvider>
      </ThemeContextProvider>
    </ApolloProvider>
  );
}
