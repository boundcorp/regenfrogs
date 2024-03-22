import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache, NormalizedCacheObject} from "@apollo/client";
import {GetServerSidePropsContext, NextPageContext} from "next";
import {useMemo} from "react";
import {setContext} from "@apollo/client/link/context";
import {getAuthToken} from "./auth";

let apolloClient: ApolloClient<NormalizedCacheObject>;

export const APOLLO_URI = process.env.NEXT_PUBLIC_APOLLO_URI || "/api/graphql/";
export const APOLLO_BACKEND_URI = process.env.APOLLO_BACKEND_URI || APOLLO_URI

export const createApolloClient = (
    link: ApolloLink,
) => {
    return new ApolloClient({
        ssrMode: !process.browser,
        cache: new InMemoryCache(),
        link,
        connectToDevTools: process.env.NODE_ENV !== "production",
    });
};

export const initializeApollo = ({
                                     initialState = undefined,
                                     ctx = undefined,
                                 }: {
    initialState?: NormalizedCacheObject;
    ctx?: NextPageContext | GetServerSidePropsContext;
}, link?: ApolloLink) => {
    const _apolloClient = apolloClient ?? createApolloClient(link || createApolloHTTPLink());

    if (initialState) {
        const existingCache = _apolloClient.extract();
        if(initialState['ROOT_QUERY']?.['myProfile'] === null) {
            delete initialState['ROOT_QUERY']['myProfile'];
        }
        _apolloClient.cache.restore({...existingCache, ...initialState});
    }

    if (process.browser && !apolloClient) apolloClient = _apolloClient;
    return _apolloClient;
};


export const useApollo = (initialState: NormalizedCacheObject) => {
    return useMemo(() => initializeApollo({initialState}, createApolloHTTPLink(APOLLO_URI)), [initialState]);
}

export function createApolloHTTPLink(uri='') {
    const httpLink = createHttpLink({
        uri: uri || APOLLO_BACKEND_URI,
        fetch,
    });
    const authLink = setContext((_, {headers}) => {
        // get the authentication token from local storage if it exists
        // return the headers to the context so httpLink can read them
        const token = getAuthToken();
        return {
            headers: {
                ...headers,
                Authorization: token ? `JWT ${token}` : "",
            }
        }
    });
    return ApolloLink.from([authLink.concat(httpLink)]);
}