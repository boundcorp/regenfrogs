/** @jsxImportSource frog/jsx */
import {Button, Frog, TextInput} from 'frog'
import {handle} from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import {devtools} from "frog/dev";

const app = new Frog({
  origin: 'http://localhost:1122/',
  browserLocation: '/:path',
  basePath: '/frames',
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const {buttonValue, status} = c
  return c.res({
    image: (
      <div style={{color: 'white', display: 'flex', fontSize: 60}}>
        {status === 'initial' ? (
          'Select your fruit!'
        ) : (
          `Selected: ${buttonValue}`
        )}
      </div>
    ),
    intents: [
      <Button value="apple">Apple</Button>,
      <Button value="banana">Banana</Button>,
      <Button value="mango">Mango</Button>
    ]
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app) 