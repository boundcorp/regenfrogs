import {backendApolloClient} from "@/src/apollo-client";
import {gql} from "@apollo/client";
import {FrogForVisitor, FrogForVisitorQueryResult, FrogProfileFragment} from "@/generated/graphql";

export const FROG_PROFILE_FIELDS = 'id species hands clothes alive imageUrl status health hunger sanity'
export const FROG_VISITOR_FIELDS = 'allowedActions cooldown'

export async function loadFrogForFid(fid: number | undefined): Promise<FrogProfileFragment | undefined> {
  const apollo = backendApolloClient({})
    if (fid) {
        try {
            const frogStatus = fid ? await apollo.query({
                query: gql`
                    query frogByFid($fid: Int!) {
                        frogByFid(fid: $fid) {
                            ... on FrogProfile {
                                ${FROG_PROFILE_FIELDS}
                            }
                        }
                    }
                `,
              variables: {fid}
            }) : null
          return frogStatus?.data?.frogByFid
        } catch (e) {
          console.error("Error fetching frog status", e)
        }
    }
}

export async function loadFrogForVisitor(id: string, fid: number | undefined): Promise<FrogForVisitor> {
  const apollo = backendApolloClient({})
    if (id) {
        try {
            const frogStatus = await apollo.query({
                query: gql`
                    query frogByFid($id: String!, $fid: Int) {
                        frogForVisitor(id: $id, fid: $fid) {
                            visitor {
                                user {
                                    id
                                }
                                cooldownUntil
                                actionsAllowed
                            }
                            frog {
                                ... on FrogProfile {
                                    ${FROG_PROFILE_FIELDS}
                                }
                            }
                        }
                    }
                `,
              variables: {fid, id}
            })
          return frogStatus?.data?.frogForVisitor
        } catch (e) {
          console.error("Error fetching frog status", e)
        }
    }
    return {frog: undefined, visitor: undefined}
}
