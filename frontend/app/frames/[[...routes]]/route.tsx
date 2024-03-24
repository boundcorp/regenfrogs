/** @jsxImportSource frog/jsx */

import {Button, Frog} from 'frog'
import {devtools} from 'frog/dev'
import {handle} from 'frog/next'
import {serveStatic} from 'frog/serve-static'
import {neynar} from "frog/middlewares";
import {fixUrls} from "@/src/urls";
import {backendApolloClient} from "@/src/apollo-client";
import {gql} from "@apollo/client";
import {loadFrogForVisitor} from "@/src/frogs";
import AdoptFrame from "@/app/frames/[[...routes]]/adopt";
import {MyFrogFrame, FrogProfileFrame} from "@/app/frames/[[...routes]]/frogs";
import React from "react";

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

app.frame("/frog/:id", async (c) => {
  const id = c.req.param('id')
  const frog = await loadFrogForVisitor(id, c.var.interactor?.fid)
  const actionsAvailable = true;
  const refreshButton = <Button value="refresh" action={`/frog/${frog?.id}`}>Refresh</Button>
  const intents = frog && actionsAvailable ? [
      <Button value="feed" action={`/frog/${frog.id}/interact`}>🥗 Feed</Button>,
      <Button value="play" action={`/frog/${frog.id}/interact`}>🎮 Play</Button>,
      <Button value="compliment" action={`/frog/${frog.id}/interact`}>👍 Compliment</Button>,
      refreshButton
  ] : [
    refreshButton
  ]
  return c.res({
    image: (
      <FrogProfileFrame frog={frog}>
        Yisss
      </FrogProfileFrame>
    ),
    intents
  })
})

app.frame("/frog/:id/interact", async (c) => {
  const id = c.req.param('id')
  const frog = await loadFrogForVisitor(id, c.var.interactor?.fid)
  const {buttonValue} = c
  return c.res({
    image: (
      frog ? buttonValue == "feed" ?

      <div style={{color: 'white', display: 'flex', fontSize: 60}}>

        <div style={{display: "flex",  width: "600px", height: "600px", border: "4px solid green", margin: "14px 10px 0" }}>
          <img src="/images/regenfrogs-frog1.jpg" alt="Frog Image" style={{ maxWidth: "600px"}} />
        </div>

        <div style={{display: "flex", flexDirection: "column", maxWidth: "500px", padding: "10px"}}>
          <div style={{display: "flex", color: "white", marginBottom: "20px"}}>
            Your frog has been fed!
          </div>
          <div style={{display: "flex", color: "white"}}>
            Hunger level: {frog.hunger}
          </div>
          <div style={{display: "flex"}}>
            <div style={{display: "flex", color: "white", fontSize: 30}}>
              You can interact again in 6 hours.
            </div>
          </div>
        </div>
        
      </div>
           :
          buttonValue == "play" ?

          <div style={{color: 'white', display: 'flex', fontSize: 60}}>

            <div style={{display: "flex",  width: "600px", height: "600px", border: "4px solid green", margin: "14px 10px 0" }}>
              <img src="/images/regenfrogs-frog1.jpg" alt="Frog Image" style={{ maxWidth: "600px"}} />
            </div>

            <div style={{display: "flex", flexDirection: "column", maxWidth: "500px", padding: "10px"}}>
              <div style={{display: "flex", color: "white", marginBottom: "20px"}}>
                You played with your frog! 
              </div>
              <div style={{display: "flex", color: "white"}}>
                Health level: {frog.health}
              </div>
              <div style={{display: "flex"}}>
                <div style={{display: "flex", color: "white", fontSize: 30}}>
                  You can interact again in 6 hours.
                </div>
              </div>
            </div>

          </div>
 :
            buttonValue == "compliment" ?

            <div style={{color: 'white', display: 'flex', fontSize: 60}}>

              <div style={{display: "flex",  width: "600px", height: "600px", border: "4px solid green", margin: "14px 10px 0" }}>
                <img src="/images/regenfrogs-frog1.jpg" alt="Frog Image" style={{ maxWidth: "600px"}} />
              </div>

              <div style={{display: "flex", flexDirection: "column", maxWidth: "500px", padding: "10px"}}>
                <div style={{display: "flex", color: "white", marginBottom: "20px"}}>
                  Your frog has been complimented!
                </div>
                <div style={{display: "flex", color: "white"}}>
                  Sanity level: {frog.sanity}
                </div>
                <div style={{display: "flex"}}>
                  <div style={{display: "flex", color: "white", fontSize: 30}}>
                    You can interact again in 6 hours.
                  </div>
                </div>
              </div>

            </div>
              :
              <div style={{color: 'white', display: 'flex', fontSize: 60}}>No Action</div>
        : <div style={{color: 'white'}}>Frog not found</div>
    ),

  })
})

devtools(app, {serveStatic})

export const GET = handle(app)
export const POST = handle(app)
