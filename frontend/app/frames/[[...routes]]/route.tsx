/** @jsxImportSource frog/jsx */

import {Button, Frog} from 'frog'
import {devtools} from 'frog/dev'
import {handle} from 'frog/next'
import {serveStatic} from 'frog/serve-static'
import {neynar} from "frog/middlewares";
import {fixUrls} from "@/src/urls";
import {backendApolloClient} from "@/src/apollo-client";
import {gql} from "@apollo/client";
import {loadFrogForFid} from "@/src/frogs";
import AdoptFrame from "@/app/frames/[[...routes]]/adopt";
import MyFrogFrame from "@/app/frames/[[...routes]]/myFrog";

const apollo = backendApolloClient({})


const app = new Frog({
  assetsPath: '/',
  basePath: '/frames',
  origin: process.env.NEXT_PUBLIC_URL
}).use(
  neynar({
    apiKey: process.env.NEYNAR_API_KEY as string,
    features: ['cast', 'interactor']
  })
).use(async (c, next) => {
    try {
      Object.keys(c.var).length && await apollo.mutate({
          mutation: gql`
              mutation FrameInteraction($frameUrl: String!, $interactionJson: String!) {
                  frameInteraction(frameUrl: $frameUrl, interactionJson: $interactionJson) {
                      ... on InteractionSuccess {
                          success
                      }
                  }
              }
          `,
        variables: {
          frameUrl: c.req.url,
          interactionJson: JSON.stringify(c.var)
        }
      })
    } catch (e) {
      console.error("analytics error", e)
    }

    // FROG WHYYYYYY
    // We have to manually replace all occurrences of http(s)://*:*/frames with process.env.NEXT_PUBLIC_URL/frames
    // because frog is ignoring our origin config, idgi

  await next()
  console.log(`Frame ${c.req.url} responded with ${c.res.status}`)
  c.res = new Response(fixUrls(await c.res.text()), {
    headers: c.res.headers,
    status: c.res.status
  })
})

app.frame('/', async (f) => {
  return f.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to top left, #73a942, #538d22, #245501)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 90,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          🐸 REGENFROGS 🐸
        </div>
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Nurture a digital amphibian with your friends and contribute to rainforest conservation.
        </div>
      </div>
    ),
    intents: [
      <Button.Redirect location="https://regenfrogs.xyz">regenfrogs.xyz</Button.Redirect>,
      <Button value="frog" action="/adopt">Get my Frog</Button>,
    ],
  })
})


app.frame("/adopt", AdoptFrame)
app.frame("/my-frog", MyFrogFrame)


app.frame('/frog/mint', (f) => {
  return f.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to top left, #73a942, #538d22, #245501)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
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
            display: "flex"
          }}
        >
          YOUR FROG DIED
        </div>

      </div>
    ),
    intents: [

      <Button value="frog" action="/mint">Mint</Button>,
    ],
  })
})

app.frame("/frog/:id", (c) => {
  const id = c.req.param('id')
  return c.res({
    image: (
       true ? <div style={{color: 'white', display: 'flex', fontSize: 60}}>
        gm
      </div> : <div style={{color: 'white'}}>Frog not found</div>
    ),
    intents: [
      <Button value="feed" action={`/frog/${id}/interact`}>🥗 Feed</Button>,
      <Button value="play" action={`/frog/${id}/interact`}>🎮 Play</Button>,
      <Button value="compliment" action={`/frog/${id}/interact`}>👍 Compliment</Button>,
    ]
  })
})

app.frame("/frog/:id/interact", (c) => {
  const id = c.req.param('id')
  const frog = FROGS?.[id]
  const {buttonValue} = c
  return c.res({
    image: (
      frog ? buttonValue == "feed" ?
          <div style={{color: 'white', display: 'flex', fontSize: 60}}>
            Your frog has been fed! Hunger level: {frog.hunger}
          </div> :
          buttonValue == "play" ?
            <div style={{color: 'white', display: 'flex', fontSize: 60}}>
              You played with your frog! Health level: ${frog.health}
            </div> :
            buttonValue == "compliment" ?
              <div style={{color: 'white', display: 'flex', fontSize: 60}}>
                Your frog has been complimented! Sanity level: ${frog.sanity}
              </div> :
              <div style={{color: 'white', display: 'flex', fontSize: 60}}>No Action</div>
        : <div style={{color: 'white'}}>Frog not found</div>
    ),

  })
})

devtools(app, {serveStatic})

export const GET = handle(app)
export const POST = handle(app)
