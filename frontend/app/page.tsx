import { getFrameMetadata } from 'frog/next'
import type { Metadata } from 'next'
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import localFont from "next/font/local"

import styles from './page.module.css'
import Link from 'next/link'
import {useMediaQuery} from "@mui/system";
import {useTheme} from "@mui/material";

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

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={myFont.className} style={{ fontSize: '10em' }}>REGENFROGS</div>
      <Card sx={{ padding: '1em', fontFamily: "Helvetiva Now Display" }}>
        <Typography variant="h3">Adopt Your Frog</Typography><Typography variant="h5" mb={"1em"}>Choose your virtual pet frog and begin your digital journey.</Typography>
        <Typography variant="h3">Care for Your Frog</Typography><Typography variant="h5" mb={"1em"}>Feed, play, and nurture your frog to keep it happy and healthy.</Typography>
        <Typography variant="h3">Mint Commemorative NFTs</Typography><Typography variant="h5">Upon your frog&apos;s digital demise, mint commemorative NFTs to immortalize its memory.</Typography>

        <Typography variant='h5' mt={"2em"}>We&apos;re proud to support the Rainforest Foundation, a committed advocate for the rights and preservation efforts of Indigenous and traditional communities inhabiting the rainforests worldwide. Proceeds from NFT minting will go towards their vital conservation efforts. Learn more at <Link href={"https://rainforestfoundation.org"} target='__blank'>https://rainforestfoundation.org</Link>.</Typography>
      </Card>
    </main>
  )
}
