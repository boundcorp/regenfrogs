/** @jsxImportSource frog/jsx */
import {Button, Frog, TextInput} from 'frog'
import {handle} from 'frog/next'

const app = new Frog({
  basePath: '/api',
  browserLocation: '/:path',
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/foo', (c) => {
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

export const GET = handle(app)
export const POST = handle(app) 