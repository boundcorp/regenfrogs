import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Container from "@mui/material/Container"
import localFont from "next/font/local"
import {Roboto_Mono} from 'next/font/google'
import Link from 'next/link'
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image'
import {Metadata} from "next";


export async function generateMetadata(): Promise<Metadata> {
  const data = {
    description: "Virtual pet frog",
    "fc:frame": "vNext",
    "fc:frame:image:aspect_ratio": "1.91:1",
    "fc:frame:image": url + "/frames/image?image=N4IglgzgohDGCGAHApgExALgC4CcCuyANCFvAOaYipgBuIxiOA9ohJqBFgJ4A2y7IeDzBkAdgEksyALZsMIWMlFSc9EACN4sANZlmeUennDRyeDgC0e%252BNSVYAFFiYACJ4md8AZlkLOAxADsAMzwAJwALABMvn4ArEEAHKiR0f6R4bGxAAwAjACUapo6ekwGqADKYABe-PI5WVkApM71TWrUEIg88FyUnnwAHmr9yAMAImA4yLBYYEyilLBMPHjSC8QjAwDqOEiUokwA7ruIagAWyCJnWJStjWoAVnicYJ5cAMLzUsqLdsiqxCkAywAEFhGJfsp-mpDmBUFgzrcGvcAL4o4iwM5gHioKYLDAAbVAkBgCBQRlwBEB5Eo1DoDGYrAEnF4tVASx4TFU8kOWKkwy%252BlRqmFCWQ2gu4fH2XOkQjUfCwKnKiC0YFEFHkFiyADospFYjJ5WrkAAJS5ka6YHLa8LEWU4MhqgAqLEwQTFIBVqGo6soWRakSyiCGxF5YCkyq0tU9Uwsxz2aIxWJxeMwBJAgF4NwAcO84AEpQADiUAAcgAxXMAeQL5Wc2ZAAF10cToHAkGhMJSiCQafI6WpGCw5BxJWyFMsuZQw-zxcohbUAGwezwS1nSnCynjy5CK-6R2BqjUgLW6-WG4gmU3my0Ya22kD2x2iF2nDDuhg2H2H-05QPBmF85A92jRhkDjE4QETBRk1xJQ0xAYs8BwLBEOQZx4GcahHVIHg0OkRAsXUMB4FEZxYQRZwuFKHBnE8HAwCUVAIDQwxnCWZQ6PUPApFcFxdjVZcpk4Vj5ggf4aHgWZ5m1BsUUbIA",
    "og:image": url + "/frames/image?image=N4IglgzgohDGCGAHApgExALgC4CcCuyANCFvAOaYipgBuIxiOA9ohJqBFgJ4A2y7IeDzBkAdgEksyALZsMIWMlFSc9EACN4sANZlmeUennDRyeDgC0e%252BNSVYAFFiYACJ4md8AZlkLOAxADsAMzwAJwALABMvn4ArEEAHKiR0f6R4bGxAAwAjACUapo6ekwGqADKYABe-PI5WVkApM71TWrUEIg88FyUnnwAHmr9yAMAImA4yLBYYEyilLBMPHjSC8QjAwDqOEiUokwA7ruIagAWyCJnWJStjWoAVnicYJ5cAMLzUsqLdsiqxCkAywAEFhGJfsp-mpDmBUFgzrcGvcAL4o4iwM5gHioKYLDAAbVAkBgCBQRlwBEB5Eo1DoDGYrAEnF4tVASx4TFU8kOWKkwy%252BlRqmFCWQ2gu4fH2XOkQjUfCwKnKiC0YFEFHkFiyADospFYjJ5WrkAAJS5ka6YHLa8LEWU4MhqgAqLEwQTFIBVqGo6soWRakSyiCGxF5YCkyq0tU9Uwsxz2aIxWJxeMwBJAgF4NwAcO84AEpQADiUAAcgAxXMAeQL5Wc2ZAAF10cToHAkGhMJSiCQafI6WpGCw5BxJWyFMsuZQw-zxcohbUAGwezwS1nSnCynjy5CK-6R2BqjUgLW6-WG4gmU3my0Ya22kD2x2iF2nDDuhg2H2H-05QPBmF85A92jRhkDjE4QETBRk1xJQ0xAYs8BwLBEOQZx4GcahHVIHg0OkRAsXUMB4FEZxYQRZwuFKHBnE8HAwCUVAIDQwxnCWZQ6PUPApFcFxdjVZcpk4Vj5ggf4aHgWZ5m1BsUUbIA",
    "og:title": "Frog Frame",
    "fc:frame:post_url": url + "/frames?initialPath=%252Fframes&amp;amp;previousButtonValues=%2523A__r%253Ahttps%253A%252F%252Fregenfrogs.xyz%252Cfrog",
    "fc:frame:button:1": "regenfrogs.xyz",
    "fc:frame:button:1:action": "post_redirect",
    "fc:frame:button:2": "Get my Frog",
    "fc:frame:button:2:action": "post",
    "fc:frame:button:2:target": url + "/frames/adopt?initialPath=%252Fframes&amp;amp;previousButtonValues=%2523A__r%253Ahttps%253A%252F%252Fregenfrogs.xyz%252Cfrog",
    "frog:version": "0.7.0",
  }
  return {other: data}
}

const myFont = localFont({src: './fonts/Catboo.ttf'})

const roboto = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400'
})

export default function Home() {

  return (

    <Container maxWidth="xl" sx={{
      textAlign: "center",
      paddingTop: '2em',
      cursor: "url('/froghand.png') auto"

    }}>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static" color="transparent" sx={{boxShadow: 0}}>
          <Toolbar>
            <Box component="div" sx={{flexGrow: 1, display: 'flex'}}>
              <Image src="/images/refrog.png" width={70} height={70} alt="RegenFrogs Logo"/>
            </Box>
            <Tooltip title="Farcaster"><Link href="https://warpcast.com/regenfrogs" target={"_blank"}><IconButton
              color="inherit"><Image src="/farcaster.png" width={30} height={30}
                                     alt="Farcaster Logo"/></IconButton></Link></Tooltip>
            <Tooltip title="BaseScan"><Link href={"https://basescan.org/address/"+process.env.NEXT_PUBLIC_BASE_MAINNET_NFT_ADDR} target={"_blank"}><IconButton
              color="inherit"><Image src="/basescan.png" width={30} height={30}
                                     alt="Basescan Logo"/></IconButton></Link></Tooltip>
            <Tooltip title="OpenSea"><Link href="https://opensea.io/assets/base/0x7cb26a92c048bd353acba27b15c7fc4677e9a9b9" target={"_blank"}><IconButton
              color="inherit"><Image src="/opensea.png" width={30} height={30} alt="OpenSea Logo"/></IconButton></Link></Tooltip>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container sx={{mb: "2em", mt: "1em"}}>
        <Grid item xs={12}>
          <div className={myFont.className} style={{fontSize: '10em'}}>REGENFROGS</div>
        </Grid>
      </Grid>

      <div className={roboto.className}>
        <Grid container alignItems={"stretch"} spacing={3} mb={"2em"}>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{padding: '2em', borderRadius: '15px'}}>
              <CardMedia component={"img"} image="/images/regenfrogs-frog1.jpg" title="Frog"
                         sx={{height: 140, objectFit: "contain"}}/>
              <CardContent>
                <h1 className={roboto.className} style={{fontWeight: 'bold', fontSize: '30px'}}>1. Adopt Your Frog</h1>
                <div className={roboto.className} style={{fontSize: '25px', marginBottom: "1em", marginTop: "0.5em"}}>
                  AI will select a profile and draw a pet frog to begin your digital journey. Every frog is uniquely
                  generated for you.
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{padding: '2em', borderRadius: '15px'}}>
              <CardMedia component={"img"} image="/images/adopted-frame.png" title="Adopted Frame"
                         sx={{height: 140, objectFit: "contain"}}/>
              <CardContent>
                <h1 className={roboto.className} style={{fontWeight: 'bold', fontSize: '30px'}}>2. Care for Your
                  Frog</h1>
                <div className={roboto.className} style={{fontSize: '25px', marginBottom: "1em", marginTop: "0.5em"}}>
                  Post your frog frame on Farcaster so your friends can help you feed, nurture, and play with your frog
                  to keep them happy and healthy.
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ padding: '2em', borderRadius: '15px' }}>
            <CardMedia component={"img"} image="/images/rainforest.jpeg" title="Rainforest" sx={{ height: 140, objectFit: "contain" }} />
              <CardContent>
              <h1 className={roboto.className} style={{ fontWeight: 'bold', fontSize: '30px' }}>3. Mint NFTs</h1>
              <div className={roboto.className} style={{ fontSize: '25px', marginBottom: "1em", marginTop: "0.5em" }}>
                All frogs go to heaven. Upon your frog&apos;s digital demise, mint commemorative NFTs to immortalize the frog's glorious memory.
              </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <div className={roboto.className} style={{ marginTop: '2em', fontSize: "30px", fontWeight: 'bold' }}>
              We&apos;re proud to support the Rainforest Foundation, a committed advocate for the rights and preservation efforts of Indigenous and traditional communities inhabiting the rainforests worldwide.<br /><br />All proceeds from NFT minting will go towards their vital conservation efforts. Learn more at <Link href={"https://rainforestfoundation.org"} target='__blank'>https://rainforestfoundation.org</Link>.
            </div>
          </Grid>
        </Grid>
      </div>
    </Container>


  )
}
