import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import Container from "@mui/material/Container"
import localFont from "next/font/local"
import { Roboto_Mono } from 'next/font/google'
import Link from 'next/link'
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image'


const myFont = localFont({ src: './fonts/Catboo.ttf' })

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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent" sx={{ boxShadow: 0 }} >
          <Toolbar>
            <Box component="div" sx={{ flexGrow: 1, display: 'flex' }}>
              <Image src="/images/refrog.png" width={70} height={70} alt="RegenFrogs Logo" />
            </Box>
            <Tooltip title="Farcaster"><Link href="https://warpcast.com" target={"_blank"}><IconButton color="inherit"><Image src="/farcaster.png" width={30} height={30} alt="Farcaster Logo" /></IconButton></Link></Tooltip>
            <Tooltip title="BaseScan"><Link href="https://basescan.org" target={"_blank"}><IconButton color="inherit"><Image src="/basescan.png" width={30} height={30} alt="Basescan Logo" /></IconButton></Link></Tooltip>
            <Tooltip title="OpenSea"><Link href="https://opensea.com" target={"_blank"}><IconButton color="inherit"><Image src="/opensea.png" width={30} height={30} alt="OpenSea Logo" /></IconButton></Link></Tooltip>
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container sx={{ mb: "2em", mt: "1em" }}>
        <Grid item xs={12}>
          <div className={myFont.className} style={{ fontSize: '10em' }}>REGENFROGS</div>
        </Grid>
      </Grid>

      <div className={roboto.className}>
        <Grid container alignItems={"stretch"} spacing={3} mb={"2em"}>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ padding: '3em', borderRadius: '15px' }}>
              <CardMedia component={"img"} image="/images/regenfrogs-frog1.jpg" title="Frog" sx={{ height: 140, objectFit: "contain" }} />
              <CardContent>
                <h1 className={roboto.className} style={{ fontWeight: 'bold', fontSize: '30px' }}>1. Adopt Your Frog</h1>
                <div className={roboto.className} style={{ fontSize: '25px', marginBottom: "1em", marginTop: "0.5em" }}>
                  AI will select a profile and draw a pet frog to begin your digital journey. Every frog is uniquely generated for you.
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ padding: '3em', borderRadius: '15px' }}>
              <h1 className={roboto.className} style={{ fontWeight: 'bold', fontSize: '30px' }}>2. Care for Your Frog</h1>
              <div className={roboto.className} style={{ fontSize: '25px', marginBottom: "1em", marginTop: "0.5em" }}>
                Post your frog frame on Farcaster so your friends can help you feed, nurture, and play with your frog to keep them happy and healthy.
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ padding: '3em', borderRadius: '15px' }}>
              <h1 className={roboto.className} style={{ fontWeight: 'bold', fontSize: '30px' }}>3. Mint NFTs</h1>
              <div className={roboto.className} style={{ fontSize: '25px', marginBottom: "1em", marginTop: "0.5em" }}>
                All frogs go to heaven. Upon your frog&apos;s digital demise, mint commemorative NFTs to immortalize the frog's glorious memory.
              </div>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <div className={roboto.className} style={{ marginTop: '2em', fontSize: "30px", fontWeight: 'bold' }}>
              We&apos;re proud to support the Rainforest Foundation, a committed advocate for the rights and preservation efforts of Indigenous and traditional communities inhabiting the rainforests worldwide. Proceeds from NFT minting will go towards their vital conservation efforts. Learn more at <Link href={"https://rainforestfoundation.org"} target='__blank'>https://rainforestfoundation.org</Link>.
            </div>
          </Grid>
        </Grid>
      </div>
    </Container>


  )
}
