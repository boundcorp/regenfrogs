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
  DateTime: any;
};

export type AdoptFrogResult = AdoptFrogSuccess | Error;

export type AdoptFrogSuccess = {
  __typename?: 'AdoptFrogSuccess';
  frog?: Maybe<FrogProfile>;
};


export type Error = {
  __typename?: 'Error';
  message: Scalars['String'];
};

export type FrogProfile = {
  __typename?: 'FrogProfile';
  alive: Scalars['Boolean'];
  clothes?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  diedAt?: Maybe<Scalars['DateTime']>;
  hands?: Maybe<Scalars['String']>;
  health: Scalars['Int'];
  hunger: Scalars['Int'];
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  ipfsImageCid?: Maybe<Scalars['String']>;
  ipfsMetadataCid?: Maybe<Scalars['String']>;
  lastLoop?: Maybe<Scalars['DateTime']>;
  mintedNftAddress?: Maybe<Scalars['String']>;
  mintedNftId?: Maybe<Scalars['Int']>;
  mintedNftReceipt?: Maybe<Scalars['String']>;
  mintedNftTxHash?: Maybe<Scalars['String']>;
  nextLoop?: Maybe<Scalars['DateTime']>;
  owner: UserProfile;
  sanity: Scalars['Int'];
  sanityCounter: Scalars['Int'];
  species?: Maybe<Scalars['String']>;
  status: FrogProfileStatus;
  updatedAt: Scalars['DateTime'];
};

export enum FrogProfileStatus {
  Content = 'CONTENT',
  Happy = 'HAPPY',
  Sad = 'SAD'
}

export type InteractionResult = Error | InteractionSuccess;

export type InteractionSuccess = {
  __typename?: 'InteractionSuccess';
  success?: Maybe<Scalars['Boolean']>;
};

export type MintedFrogInput = {
  address: Scalars['String'];
  id: Scalars['String'];
  nftId: Scalars['Int'];
  receipt: Scalars['String'];
  txHash: Scalars['String'];
};

export type MintedFrogResult = Error | MintedFrogSuccess;

export type MintedFrogSuccess = {
  __typename?: 'MintedFrogSuccess';
  frog?: Maybe<FrogProfile>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adoptFrog?: Maybe<AdoptFrogResult>;
  frameInteraction?: Maybe<InteractionResult>;
  mintedFrog?: Maybe<MintedFrogResult>;
};


export type MutationAdoptFrogArgs = {
  fid: Scalars['Int'];
};


export type MutationFrameInteractionArgs = {
  frameUrl: Scalars['String'];
  interactionJson: Scalars['String'];
};


export type MutationMintedFrogArgs = {
  input?: Maybe<MintedFrogInput>;
};

export type Query = {
  __typename?: 'Query';
  frogByFid?: Maybe<FrogProfile>;
  frogForVisitor?: Maybe<FrogProfile>;
  myProfile?: Maybe<UserProfile>;
};


export type QueryFrogByFidArgs = {
  fid: Scalars['Int'];
};


export type QueryFrogForVisitorArgs = {
  fid: Scalars['Int'];
  id: Scalars['String'];
};

export type UserProfile = {
  __typename?: 'UserProfile';
  email: Scalars['String'];
  farcasterId: Scalars['Int'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  isStaff: Scalars['Boolean'];
  lastName: Scalars['String'];
  username: Scalars['String'];
};

export type UserProfileFragment = { __typename?: 'UserProfile', id: string, firstName: string, lastName: string, email: string, username: string };

export type FrogProfileFragment = { __typename?: 'FrogProfile', id: string, status: FrogProfileStatus, health: number, sanity: number, hunger: number, alive: boolean, species?: Maybe<string>, imageUrl?: Maybe<string>, ipfsImageCid?: Maybe<string>, ipfsMetadataCid?: Maybe<string>, mintedNftId?: Maybe<number> };

export type FrogForVisitorQueryVariables = Exact<{
  id: Scalars['String'];
  fid: Scalars['Int'];
}>;


export type FrogForVisitorQuery = { __typename?: 'Query', frogForVisitor?: Maybe<(
    { __typename?: 'FrogProfile' }
    & FrogProfileFragment
  )> };

export type FrogByFidQueryVariables = Exact<{
  fid: Scalars['Int'];
}>;


export type FrogByFidQuery = { __typename?: 'Query', frogByFid?: Maybe<(
    { __typename?: 'FrogProfile' }
    & FrogProfileFragment
  )> };

export type AdoptFrogMutationVariables = Exact<{
  fid: Scalars['Int'];
}>;


export type AdoptFrogMutation = { __typename?: 'Mutation', adoptFrog?: Maybe<{ __typename: 'AdoptFrogSuccess', frog?: Maybe<(
      { __typename?: 'FrogProfile' }
      & FrogProfileFragment
    )> } | { __typename: 'Error', message: string }> };

export type MintedFrogMutationVariables = Exact<{
  input: MintedFrogInput;
}>;


export type MintedFrogMutation = { __typename?: 'Mutation', mintedFrog?: Maybe<{ __typename: 'Error', message: string } | { __typename: 'MintedFrogSuccess', frog?: Maybe<(
      { __typename?: 'FrogProfile' }
      & FrogProfileFragment
    )> }> };

export type FrameInteractionMutationVariables = Exact<{
  interactionJson: Scalars['String'];
  frameUrl: Scalars['String'];
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
export const FrogProfileFragmentDoc = gql`
    fragment FrogProfile on FrogProfile {
        owner {
            id
            username
        }
        id
        status
        health
        sanity
        hunger
        alive
        species
        imageUrl
        ipfsImageCid
        ipfsMetadataCid
        mintedNftId
    }
`;
export const FrogForVisitorDocument = gql`
    query frogForVisitor($id: String!, $fid: Int!) {
  frogForVisitor(id: $id, fid: $fid) {
    ...FrogProfile
  }
}
    ${FrogProfileFragmentDoc}`;

/**
 * __useFrogForVisitorQuery__
 *
 * To run a query within a React component, call `useFrogForVisitorQuery` and pass it any options that fit your needs.
 * When your component renders, `useFrogForVisitorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFrogForVisitorQuery({
 *   variables: {
 *      id: // value for 'id'
 *      fid: // value for 'fid'
 *   },
 * });
 */
export function useFrogForVisitorQuery(baseOptions?: Apollo.QueryHookOptions<FrogForVisitorQuery, FrogForVisitorQueryVariables>) {
        return Apollo.useQuery<FrogForVisitorQuery, FrogForVisitorQueryVariables>(FrogForVisitorDocument, baseOptions);
      }
export function useFrogForVisitorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FrogForVisitorQuery, FrogForVisitorQueryVariables>) {
          return Apollo.useLazyQuery<FrogForVisitorQuery, FrogForVisitorQueryVariables>(FrogForVisitorDocument, baseOptions);
        }
export type FrogForVisitorQueryHookResult = ReturnType<typeof useFrogForVisitorQuery>;
export type FrogForVisitorLazyQueryHookResult = ReturnType<typeof useFrogForVisitorLazyQuery>;
export type FrogForVisitorQueryResult = Apollo.QueryResult<FrogForVisitorQuery, FrogForVisitorQueryVariables>;
export const FrogByFidDocument = gql`
    query frogByFid($fid: Int!) {
  frogByFid(fid: $fid) {
    ...FrogProfile
  }
}
    ${FrogProfileFragmentDoc}`;

/**
 * __useFrogByFidQuery__
 *
 * To run a query within a React component, call `useFrogByFidQuery` and pass it any options that fit your needs.
 * When your component renders, `useFrogByFidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFrogByFidQuery({
 *   variables: {
 *      fid: // value for 'fid'
 *   },
 * });
 */
export function useFrogByFidQuery(baseOptions?: Apollo.QueryHookOptions<FrogByFidQuery, FrogByFidQueryVariables>) {
        return Apollo.useQuery<FrogByFidQuery, FrogByFidQueryVariables>(FrogByFidDocument, baseOptions);
      }
export function useFrogByFidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FrogByFidQuery, FrogByFidQueryVariables>) {
          return Apollo.useLazyQuery<FrogByFidQuery, FrogByFidQueryVariables>(FrogByFidDocument, baseOptions);
        }
export type FrogByFidQueryHookResult = ReturnType<typeof useFrogByFidQuery>;
export type FrogByFidLazyQueryHookResult = ReturnType<typeof useFrogByFidLazyQuery>;
export type FrogByFidQueryResult = Apollo.QueryResult<FrogByFidQuery, FrogByFidQueryVariables>;
export const AdoptFrogDocument = gql`
    mutation adoptFrog($fid: Int!) {
  adoptFrog(fid: $fid) {
    __typename
    ... on AdoptFrogSuccess {
      frog {
        ...FrogProfile
      }
    }
    ... on Error {
      message
    }
  }
}
    ${FrogProfileFragmentDoc}`;
export type AdoptFrogMutationFn = Apollo.MutationFunction<AdoptFrogMutation, AdoptFrogMutationVariables>;

/**
 * __useAdoptFrogMutation__
 *
 * To run a mutation, you first call `useAdoptFrogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAdoptFrogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [adoptFrogMutation, { data, loading, error }] = useAdoptFrogMutation({
 *   variables: {
 *      fid: // value for 'fid'
 *   },
 * });
 */
export function useAdoptFrogMutation(baseOptions?: Apollo.MutationHookOptions<AdoptFrogMutation, AdoptFrogMutationVariables>) {
        return Apollo.useMutation<AdoptFrogMutation, AdoptFrogMutationVariables>(AdoptFrogDocument, baseOptions);
      }
export type AdoptFrogMutationHookResult = ReturnType<typeof useAdoptFrogMutation>;
export type AdoptFrogMutationResult = Apollo.MutationResult<AdoptFrogMutation>;
export type AdoptFrogMutationOptions = Apollo.BaseMutationOptions<AdoptFrogMutation, AdoptFrogMutationVariables>;
export const MintedFrogDocument = gql`
    mutation mintedFrog($input: MintedFrogInput!) {
  mintedFrog(input: $input) {
    __typename
    ... on MintedFrogSuccess {
      frog {
        ...FrogProfile
      }
    }
    ... on Error {
      message
    }
  }
}
    ${FrogProfileFragmentDoc}`;
export type MintedFrogMutationFn = Apollo.MutationFunction<MintedFrogMutation, MintedFrogMutationVariables>;

/**
 * __useMintedFrogMutation__
 *
 * To run a mutation, you first call `useMintedFrogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMintedFrogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mintedFrogMutation, { data, loading, error }] = useMintedFrogMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMintedFrogMutation(baseOptions?: Apollo.MutationHookOptions<MintedFrogMutation, MintedFrogMutationVariables>) {
        return Apollo.useMutation<MintedFrogMutation, MintedFrogMutationVariables>(MintedFrogDocument, baseOptions);
      }
export type MintedFrogMutationHookResult = ReturnType<typeof useMintedFrogMutation>;
export type MintedFrogMutationResult = Apollo.MutationResult<MintedFrogMutation>;
export type MintedFrogMutationOptions = Apollo.BaseMutationOptions<MintedFrogMutation, MintedFrogMutationVariables>;
export const FrameInteractionDocument = gql`
    mutation frameInteraction($interactionJson: String!, $frameUrl: String!) {
  frameInteraction(interactionJson: $interactionJson, frameUrl: $frameUrl) {
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
 *      frameUrl: // value for 'frameUrl'
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