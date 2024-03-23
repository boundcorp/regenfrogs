/** @jsxImportSource frog/jsx */

import {Button, Frog} from 'frog'
import {devtools} from 'frog/dev'
import {handle} from 'frog/next'
import {serveStatic} from 'frog/serve-static'
import {neynar} from "frog/middlewares";
import {fixUrls} from "@/src/urls";
import {backendApolloClient} from "@/src/apollo-client";
import {gql} from "@apollo/client";

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
  console.log(JSON.stringify(c.var).replaceAll('"', '\\"'))
  try {
    console.log("analytics", c.req.url, c.var)
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
    }) && console.log("ok", c.var.interactor?.fid)
  } catch (e) {
    console.error("analytics error", e)
  }

  // FROG WHYYYYYY
  // We have to manually replace all occurrences of http(s)://*:*/frames with process.env.NEXT_PUBLIC_URL/frames
  // because frog is ignoring our origin config, idgi

  await next()
  c.res = new Response(fixUrls(await c.res.text()), {
    headers: c.res.headers,
    status: c.res.status
  })
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

type FrogProfile = {
  alive: boolean
  status: string
  hunger: number
  health: number
  sanity: number

}

const LIVE_FROG: FrogProfile = {
  alive: true,
  status: "happy",
  hunger: 90,
  health: 85,
  sanity: 100,
}
const FROGS: Record<string, FrogProfile> = {
  "1": LIVE_FROG
}

app.frame('/', (f) => {
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

app.frame("/adopt", (c) => {
  const {buttonValue, inputText, status} = c
  return c.res({
    image: (
      <div
        style={{
          background:
            status === 'response'
              ? 'linear-gradient(to top left, #73a942, #538d22, #245501)'
              : 'black',
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
      </div>
    ),
    intents: [
      <Button value="frog" action="/frog/:id">Adopt my Buddy</Button>,
    ],
  })
})


const DEATH_REASONS = ["Accidentally overdosed on virtual caffeine after drinking too many digital energy drinks",
  "Got caught up in a heated debate with a virtual fly and forgot to eat",
  "Attempted a daring escape from its virtual terrarium and got lost in the digital jungle",
  "Fell victim to a virtual reality glitch that turned its surroundings into a pixelated mess",
  "Engaged in a virtual rap battle with a rival frog and lost its voice from all the croaking",
  "Tried to impress a virtual frog date with a risky skydiving stunt and landed on a pixelated cactus",
  "Developed a sudden obsession with playing virtual video games and forgot to eat",
  "Got into a virtual food fight with a group of mischievous digital squirrels and lost",
  "Accidentally activated a self-destruct button while trying to unlock a secret level in its virtual habitat",
  "Attempted to reenact scenes from a virtual action movie and ended up in a pixelated explosion",
  "Fell asleep while binging on virtual reality TV and forgot to wake up for dinner",
  "Engaged in a virtual dance-off with a rival frog and tripped over its own virtual feet",
  "Tried to impress its virtual friends by attempting a dangerous stunt jump and landed in a virtual pond without water",
  "Mistook a virtual hot dog for a virtual snake and attempted to eat it",
  "Got distracted by a virtual rainbow and accidentally hopped off a virtual cliff",
  "Developed a case of virtual stage fright during a virtual talent show and froze on stage",
  "Attempted to prank its virtual owner by hiding in a virtual freezer and got frostbite",
  "Got carried away while practicing its virtual yoga moves and twisted itself into a digital knot",
  "Became a virtual superhero for a day and attempted to fly off a virtual building",
  "Tried to break a virtual world record for the longest virtual hop and ran out of virtual energy halfway through",
  "Developed a virtual addiction to playing virtual reality games and forgot to eat or sleep",
  "Participated in a virtual cooking competition and accidentally ate its own virtual dish, which turned out to be toxic",
  "Attempted to imitate a virtual ninja and got tangled in its own virtual ninja robe",
  "Joined a virtual frog choir and croaked so loudly that it shattered its own virtual eardrums",
  "Tried to impress its virtual crush by attempting a virtual magic trick and accidentally made itself disappear",
  "Accepted a virtual dare to eat a virtual spicy pepper and suffered from a virtual case of indigestion",
  "Fell victim to a virtual prank involving a virtual catapult and a virtual bucket of virtual water",
  "Attempted to break the virtual world record for the longest virtual jump and overshot its landing, crashing into a virtual wall",
  "Got into a virtual paintball battle with a group of virtual frogs and accidentally swallowed a virtual paintball",
  "Became addicted to virtual reality shopping and spent all its virtual currency on virtual luxury items, forgetting to buy food"
]

function choose(choices = DEATH_REASONS) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

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
          YOUR FROG DIED FROM {choose()}
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
  const frog = FROGS?.[id]
  return c.res({
    image: (
      frog ? <div style={{color: 'white', display: 'flex', fontSize: 60}}>
        gm, {frog.status}
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
