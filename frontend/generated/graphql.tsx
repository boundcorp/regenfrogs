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

export type LogoutResult = Error | LogoutSuccess;

export type LogoutSuccess = {
  __typename?: 'LogoutSuccess';
  success?: Maybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  logout?: Maybe<LogoutResult>;
  passwordReset?: Maybe<PasswordResetResult>;
  registerBusiness?: Maybe<RegisterResult>;
  sendPasswordResetEmail?: Maybe<SendPasswordResetEmailResult>;
  tokenAuth?: Maybe<TokenAuthResult>;
  updateUserProfile?: Maybe<UpdateUserProfileResult>;
};


export type MutationPasswordResetArgs = {
  newPassword1: Scalars['String'];
  newPassword2: Scalars['String'];
  token: Scalars['String'];
};


export type MutationRegisterBusinessArgs = {
  input?: Maybe<RegisterInput>;
};


export type MutationSendPasswordResetEmailArgs = {
  email: Scalars['String'];
};


export type MutationTokenAuthArgs = {
  password: Scalars['String'];
  username_Iexact: Scalars['String'];
};


export type MutationUpdateUserProfileArgs = {
  input?: Maybe<UpdateUserProfileInput>;
};

export type PasswordResetResult = Error | PasswordResetSuccess;

export type PasswordResetSuccess = {
  __typename?: 'PasswordResetSuccess';
  success?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  myProfile?: Maybe<UserProfile>;
};

export type RegisterInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  passwordConfirm: Scalars['String'];
};

export type RegisterResult = Error | RegisterSuccess;

export type RegisterSuccess = {
  __typename?: 'RegisterSuccess';
  user?: Maybe<UserProfile>;
};

export type SendPasswordResetEmailResult = Error | SendPasswordResetEmailSuccess;

export type SendPasswordResetEmailSuccess = {
  __typename?: 'SendPasswordResetEmailSuccess';
  success?: Maybe<Scalars['Boolean']>;
};

export type TokenAuthResult = Error | TokenAuthSuccess;

export type TokenAuthSuccess = {
  __typename?: 'TokenAuthSuccess';
  refreshToken?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  user?: Maybe<UserProfile>;
};

export type UpdateUserProfileInput = {
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type UpdateUserProfileResult = Error | UpdateUserProfileSuccess;

export type UpdateUserProfileSuccess = {
  __typename?: 'UpdateUserProfileSuccess';
  user?: Maybe<UserProfile>;
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

export type TokenAuthMutationVariables = Exact<{
  username_Iexact: Scalars['String'];
  password: Scalars['String'];
}>;


export type TokenAuthMutation = { __typename?: 'Mutation', tokenAuth?: Maybe<{ __typename: 'Error', message: string } | { __typename: 'TokenAuthSuccess', token?: Maybe<string>, refreshToken?: Maybe<string> }> };

export type SendPasswordResetEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendPasswordResetEmailMutation = { __typename?: 'Mutation', sendPasswordResetEmail?: Maybe<{ __typename: 'Error', message: string } | { __typename: 'SendPasswordResetEmailSuccess', success?: Maybe<boolean> }> };

export type PasswordResetMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword1: Scalars['String'];
  newPassword2: Scalars['String'];
}>;


export type PasswordResetMutation = { __typename?: 'Mutation', passwordReset?: Maybe<{ __typename: 'Error', message: string } | { __typename: 'PasswordResetSuccess', success?: Maybe<boolean> }> };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: Maybe<{ __typename: 'Error', message: string } | { __typename: 'LogoutSuccess', success?: Maybe<boolean> }> };

export type UpdateUserProfileMutationVariables = Exact<{
  input?: Maybe<UpdateUserProfileInput>;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUserProfile?: Maybe<{ __typename: 'Error', message: string } | { __typename: 'UpdateUserProfileSuccess', user?: Maybe<(
      { __typename?: 'UserProfile' }
      & UserProfileFragment
    )> }> };

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
export const TokenAuthDocument = gql`
    mutation tokenAuth($username_Iexact: String!, $password: String!) {
  tokenAuth(username_Iexact: $username_Iexact, password: $password) {
    __typename
    ... on TokenAuthSuccess {
      token
      refreshToken
    }
    ... on Error {
      message
    }
  }
}
    `;
export type TokenAuthMutationFn = Apollo.MutationFunction<TokenAuthMutation, TokenAuthMutationVariables>;

/**
 * __useTokenAuthMutation__
 *
 * To run a mutation, you first call `useTokenAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTokenAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tokenAuthMutation, { data, loading, error }] = useTokenAuthMutation({
 *   variables: {
 *      username_Iexact: // value for 'username_Iexact'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useTokenAuthMutation(baseOptions?: Apollo.MutationHookOptions<TokenAuthMutation, TokenAuthMutationVariables>) {
        return Apollo.useMutation<TokenAuthMutation, TokenAuthMutationVariables>(TokenAuthDocument, baseOptions);
      }
export type TokenAuthMutationHookResult = ReturnType<typeof useTokenAuthMutation>;
export type TokenAuthMutationResult = Apollo.MutationResult<TokenAuthMutation>;
export type TokenAuthMutationOptions = Apollo.BaseMutationOptions<TokenAuthMutation, TokenAuthMutationVariables>;
export const SendPasswordResetEmailDocument = gql`
    mutation sendPasswordResetEmail($email: String!) {
  sendPasswordResetEmail(email: $email) {
    __typename
    ... on SendPasswordResetEmailSuccess {
      success
    }
    ... on Error {
      message
    }
  }
}
    `;
export type SendPasswordResetEmailMutationFn = Apollo.MutationFunction<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>;

/**
 * __useSendPasswordResetEmailMutation__
 *
 * To run a mutation, you first call `useSendPasswordResetEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendPasswordResetEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendPasswordResetEmailMutation, { data, loading, error }] = useSendPasswordResetEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendPasswordResetEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>) {
        return Apollo.useMutation<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>(SendPasswordResetEmailDocument, baseOptions);
      }
export type SendPasswordResetEmailMutationHookResult = ReturnType<typeof useSendPasswordResetEmailMutation>;
export type SendPasswordResetEmailMutationResult = Apollo.MutationResult<SendPasswordResetEmailMutation>;
export type SendPasswordResetEmailMutationOptions = Apollo.BaseMutationOptions<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>;
export const PasswordResetDocument = gql`
    mutation passwordReset($token: String!, $newPassword1: String!, $newPassword2: String!) {
  passwordReset(
    token: $token
    newPassword1: $newPassword1
    newPassword2: $newPassword2
  ) {
    __typename
    ... on PasswordResetSuccess {
      success
    }
    ... on Error {
      message
    }
  }
}
    `;
export type PasswordResetMutationFn = Apollo.MutationFunction<PasswordResetMutation, PasswordResetMutationVariables>;

/**
 * __usePasswordResetMutation__
 *
 * To run a mutation, you first call `usePasswordResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePasswordResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [passwordResetMutation, { data, loading, error }] = usePasswordResetMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword1: // value for 'newPassword1'
 *      newPassword2: // value for 'newPassword2'
 *   },
 * });
 */
export function usePasswordResetMutation(baseOptions?: Apollo.MutationHookOptions<PasswordResetMutation, PasswordResetMutationVariables>) {
        return Apollo.useMutation<PasswordResetMutation, PasswordResetMutationVariables>(PasswordResetDocument, baseOptions);
      }
export type PasswordResetMutationHookResult = ReturnType<typeof usePasswordResetMutation>;
export type PasswordResetMutationResult = Apollo.MutationResult<PasswordResetMutation>;
export type PasswordResetMutationOptions = Apollo.BaseMutationOptions<PasswordResetMutation, PasswordResetMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout {
    __typename
    ... on LogoutSuccess {
      success
    }
    ... on Error {
      message
    }
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation updateUserProfile($input: UpdateUserProfileInput) {
  updateUserProfile(input: $input) {
    __typename
    ... on UpdateUserProfileSuccess {
      user {
        ...UserProfile
      }
    }
    ... on Error {
      message
    }
  }
}
    ${UserProfileFragmentDoc}`;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, baseOptions);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
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