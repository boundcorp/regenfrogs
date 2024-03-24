/** @jsxImportSource frog/jsx */

import {gql} from "@apollo/client";
import {Button, FrameHandler} from "frog";
import {FROG_PROFILE_FIELDS, loadFrogForFid} from "@/src/frogs";
import {backendApolloClient} from "@/src/apollo-client";
import {MyFrogFrame} from "./frogs";

const AdoptFrame: FrameHandler = async (c)  => {
  const apollo = backendApolloClient({})
  const myFrog = await loadFrogForFid(c.var.interactor?.fid)
  const {buttonValue, inputText, status} = c
    if (myFrog?.id) {
      console.log("Frog exists", myFrog)
      return MyFrogFrame(c)
    } else if (buttonValue == "adopt") {
      console.log("Adopting...")
        const adopted = await apollo.mutate({
            mutation: gql`
                mutation adoptFrog($fid: Int!) {
                    adoptFrog(fid: $fid) {
                        ... on AdoptFrogSuccess {
                            frog {
                                ${FROG_PROFILE_FIELDS}
                            }
                        }
                    }
                }
            `,
          variables: {fid: c.var.interactor?.fid}
        })
      console.log("Adopted", JSON.stringify(adopted?.data))
      return MyFrogFrame(c)
    } else {
      console.log("How it works")
      return c.res({
        image: <div
          style={{
            background: 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            textAlign: 'left',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 50,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            🤗 1. Adopt a frog
          </div>

          <div
            style={{
              color: 'white',
              fontSize: 50,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}>
            🥗 2. You and friends feed your frog
          </div>

          <div
            style={{
              color: 'white',
              fontSize: 50,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}>
            ☠️ 3. Frog dies
          </div>

          <div style={{
            color: 'white',
            fontSize: 50,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}>
            🖼️ 4. Mint a commemorative NFT
          </div>

          <div
            style={{
              color: 'white',
              fontSize: 50,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}>
            💸 5. All proceeds go directly to Rainforest Foundation
          </div>
        </div>,

        intents: [
          <Button value="adopt" action="/adopt">Adopt my Buddy</Button>,
        ],
      })
    }
}

export default AdoptFrame