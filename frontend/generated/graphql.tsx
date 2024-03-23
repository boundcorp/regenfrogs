import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Error = {
  __typename?: 'Error';
  message: Scalars['String'];
};

export type InteractionResult = Error | InteractionSuccess;

export type InteractionSuccess = {
  __typename?: 'InteractionSuccess';
  success?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  frameInteraction?: Maybe<InteractionResult>;
};


export type MutationFrameInteractionArgs = {
  interactionJson?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  myProfile?: Maybe<UserProfile>;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  isStaff: Scalars['Boolean'];
  lastName: Scalars['String'];
  username: Scalars['String'];
};

export type UserProfileFragment = { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, email: string, username: string };

export type FrameInteractionMutationVariables = Exact<{
  interactionJson: Scalars['String'];
}>;


export type FrameInteractionMutation = { __typename?: 'Mutation', frameInteraction?: Maybe<{ __typename?: 'Error' } | { __typename?: 'InteractionSuccess', success?: Maybe<boolean> }> };

export type MyProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProfileQuery = { __typename?: 'Query', myProfile?: Maybe<(
    { __typename?: 'UserProfile' }
    & UserProfileFragment
  )> };

export const UserProfileFragmentDoc = gql`
    fragment UserProfile on UserProfile {
  id
  firstName
  lastName
  email
  username
}
    `;
export const FrameInteractionDocument = gql`
    mutation frameInteraction($interactionJson: String!) {
  frameInteraction(interactionJson: $interactionJson) {
    ... on InteractionSuccess {
      success
    }
  }
}
    `;
export type FrameInteractionMutationFn = Apollo.MutationFunction<FrameInteractionMutation, FrameInteractionMutationVariables>;

/**
 * __useFrameInteractionMutation__
 *
 * To run a mutation, you first call `useFrameInteractionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFrameInteractionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [frameInteractionMutation, { data, loading, error }] = useFrameInteractionMutation({
 *   variables: {
 *      interactionJson: // value for 'interactionJson'
 *   },
 * });
 */
export function useFrameInteractionMutation(baseOptions?: Apollo.MutationHookOptions<FrameInteractionMutation, FrameInteractionMutationVariables>) {
        return Apollo.useMutation<FrameInteractionMutation, FrameInteractionMutationVariables>(FrameInteractionDocument, baseOptions);
      }
export type FrameInteractionMutationHookResult = ReturnType<typeof useFrameInteractionMutation>;
export type FrameInteractionMutationResult = Apollo.MutationResult<FrameInteractionMutation>;
export type FrameInteractionMutationOptions = Apollo.BaseMutationOptions<FrameInteractionMutation, FrameInteractionMutationVariables>;
export const MyProfileDocument = gql`
    query myProfile {
  myProfile {
    ...UserProfile
  }
}
    ${UserProfileFragmentDoc}`;

/**
 * __useMyProfileQuery__
 *
 * To run a query within a React component, call `useMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyProfileQuery(baseOptions?: Apollo.QueryHookOptions<MyProfileQuery, MyProfileQueryVariables>) {
        return Apollo.useQuery<MyProfileQuery, MyProfileQueryVariables>(MyProfileDocument, baseOptions);
      }
export function useMyProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyProfileQuery, MyProfileQueryVariables>) {
          return Apollo.useLazyQuery<MyProfileQuery, MyProfileQueryVariables>(MyProfileDocument, baseOptions);
        }
export type MyProfileQueryHookResult = ReturnType<typeof useMyProfileQuery>;
export type MyProfileLazyQueryHookResult = ReturnType<typeof useMyProfileLazyQuery>;
export type MyProfileQueryResult = Apollo.QueryResult<MyProfileQuery, MyProfileQueryVariables>;