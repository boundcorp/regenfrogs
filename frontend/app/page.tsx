import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Container from "@mui/material/Container"
import localFont from "next/font/local"
import { Roboto_Mono } from 'next/font/google'
import Link from 'next/link'
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const myFont = localFont({ src: './fonts/Catboo.ttf' })

/*
export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || 'http://localhost:3000'}/api`,
  )
  return {
    other: frameTags,
  }
}
*/

const roboto = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400'
})

export default function Home() {

  return (

    <Container maxWidth="xl" sx={{
      textAlign: "center",
      paddingTop: '2em'

    }}>
      <Grid container sx={{ mb: "2em" }}>
        <Grid item xs={12}>
          <div className={myFont.className} style={{ fontSize: '10em' }}>REGENFROGS</div>
        </Grid>
      </Grid>

      <div className={roboto.className}>
        <Grid container alignItems={"stretch"} spacing={3}>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ padding: '3em', borderRadius: '15px' }}>
              <CardMedia component={"img"} image="/images/regenfrogs-frog1.jpg" title="Frog" sx={{ height: 140, objectFit: "contain" }} />
              <CardContent>
                <h1 className={roboto.className} style={{ fontWeight: 'bold', fontSize: '30px' }}>1. Adopt Your Frog</h1>
                <div className={roboto.className} style={{ fontSize: '25px', marginBottom: "1em", marginTop: "0.5em" }}>AI will select a profile and draw a pet frog to begin your digital journey. Every frog is uniquely generated for you.</div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ padding: '3em', borderRadius: '15px' }}>
              <h1 className={roboto.className} style={{ fontWeight: 'bold', fontSize: '30px' }}>2. Care for Your Frog</h1>
              <div className={roboto.className} style={{ fontSize: '25px', marginBottom: "1em", marginTop: "0.5em" }}>Post your frog frame on Farcaster so your friends can help you feed, nurture, and play with your frog to keep them happy and healthy.</div>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ padding: '3em', borderRadius: '15px' }}>
              <h1 className={roboto.className} style={{ fontWeight: 'bold', fontSize: '30px' }}>3. Mint NFTs</h1>
              <div className={roboto.className} style={{ fontSize: '25px', marginBottom: "1em", marginTop: "0.5em" }}>All frogs go to heaven. Upon your frog&apos;s digital demise, mint commemorative NFTs to immortalize the frog's glorious memory.</div>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <div className={roboto.className} style={{ marginTop: '2em', fontSize: "30px", fontWeight: 'bold' }}>We&apos;re proud to support the Rainforest Foundation, a committed advocate for the rights and preservation efforts of Indigenous and traditional communities inhabiting the rainforests worldwide. Proceeds from NFT minting will go towards their vital conservation efforts. Learn more at <Link href={"https://rainforestfoundation.org"} target='__blank'>https://rainforestfoundation.org</Link>.</div>
          </Grid>
        </Grid>
      </div>
    </Container>


  )
}
