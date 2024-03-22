export const parseGQLErrorMessage = (e: any) => {
  const gqlError = e.graphQLErrors?.[0];
  if (gqlError) {
    return (
      gqlError?.extensions?.validationErrors?.[0].meta?.message ?? gqlError.message
    );
  }
};