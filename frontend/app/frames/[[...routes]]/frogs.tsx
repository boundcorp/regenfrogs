/** @jsxImportSource frog/jsx */

import {Button, FrameHandler} from "frog";
import {loadFrogForFid} from "@/src/frogs";
import {FrogProfileFragment} from "@/generated/graphql";
import React from "react";


export const FrogProfileFrame = ({children, frog}: {children: React.ReactNode, frog: FrogProfileFragment | undefined}) => {
  return frog ?
    <div style={{color: 'white', display: 'flex', fontSize: 60}}>
      <div style={{
        display: "flex",
        width: "600px",
        height: "600px",
        margin: "14px 10px 0"
      }}>
        <img src={frog.imageUrl || ""} alt="Frog Image" height={600} width={600} />
      </div>

      <div style={{display: "flex", flexDirection: "column", maxWidth: "500px", padding: "10px"}}>
        {children}

        <div style={{display: "flex", color: "white"}}>
          Health: {frog.health || "0"}
        </div>

        <div style={{display: "flex", color: "white"}}>
          Hunger: {frog.hunger || "0"}
        </div>

        <div style={{display: "flex", color: "white"}}>
          Sanity: {frog.sanity || "0"}
        </div>

      </div>
    </div> : <div style={{color: 'white', background: 'black', fontSize: '60', width: "100%", height: "100%"}}>Frog not found</div>

}

export const MyFrogFrame: FrameHandler = async (c) => {
  const frog = await loadFrogForFid(parseInt(c.var.interactor?.fid))
  if (frog !== undefined) {

    const shareText = `I adopted a ${frog.species?.split(' - ')[0]} on WarpCast!`
    const embedURL = process.env.NEXT_PUBLIC_URL + "/frames/frog/" + frog.id
    const shareURL = `https://warpcast.com/~/compose?text=${shareText + embedURL}&embeds%5B%5D=${embedURL}`
    return c.res({
      image: (
        <FrogProfileFrame frog={frog}>
          <div style={{display: "flex", color: "white", marginBottom: "20px"}}>
            Congratulations
          </div>
          <div style={{display: "flex", flexWrap: "nowrap"}}>
            <div style={{display: "flex", color: "white", fontSize: 30, marginBottom: "20px"}}>
              You adopted a {frog.species}
            </div>
          </div>
        </FrogProfileFrame>
      ),
      intents: [
        <Button.Redirect location={shareURL}>Share this Frame</Button.Redirect>,
      ]
    })
  } else {
    return c.res({
      image: <div style={{display: "flex"}}>
        You don't have a frog yet. Would you like to adopt one?
      </div>,
      intents: [
        <Button value="adopt" action="/adopt">Adopt a frog</Button>,
      ]
    })
  }
}