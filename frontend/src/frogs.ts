import {backendApolloClient} from "@/src/apollo-client";
import {gql} from "@apollo/client";
import {FrogProfileFragment} from "@/generated/graphql";

export async function loadFrogForFid(fid: number | undefined): Promise<FrogProfileFragment | undefined> {
  const apollo = backendApolloClient({})
    if (fid) {
        try {
            const frogStatus = fid ? await apollo.query({
                query: gql`
                    query frogByFid($fid: Int!) {
                        frogByFid(fid: $fid) {
                            ... on FrogProfile {
                                id
                                species
                                hands
                                clothes
                                alive
                                imageUrl
                                status
                                health
                                hunger
                                sanity
                            }
                        }
                    }
                `,
              variables: {fid}
            }) : null
          console.log("Loaded frog for", fid, frogStatus?.data?.frogByFid)
          return frogStatus?.data?.frogByFid
        } catch (e) {
          console.error("Error fetching frog status", e)
        }
    }
}