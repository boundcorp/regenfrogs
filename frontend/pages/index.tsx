import React, {FC} from "react";
import Head from "next/head";
import {GetServerSideProps} from "next";
import {
  MyProfileDocument,
} from "../generated/graphql";
import {initializeApollo} from "../lib/apollo-client";
import Container from "@mui/material/Container";

export default function Home() {

  return (
    <>
      <Head>
        <title></title>
        <meta
          name="description"
          content=""
        />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Container maxWidth="xl" sx={{textAlign: "center"}}>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  initialApolloState?: string;
}> = async (ctx) => {
  const apolloClient = initializeApollo({ctx});

  /* The below code is an example of how to use an SSR query to populate the cache;
      however please be advised that this specific example will have no effect --
      the MyProfileDocument is explicitely unloaded in the apolloClient cache
      to prevent the user from receiving a logged-out stale cache despite being logged in.
      In the future, for logged-in SSR, consider passing the frontend's JWT to the apollo client here.
   */
  try {
    await apolloClient.query({
      query: MyProfileDocument,
    });
  } catch (err) {
    console.error({err});
  }

  return {
    props: {
      initialApolloState: JSON.stringify(apolloClient.cache.extract()),
    },
  };
};