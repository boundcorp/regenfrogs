/** @jsxImportSource frog/jsx */

import {gql} from "@apollo/client";
import {Button, FrameHandler} from "frog";
import {loadFrogForFid} from "@/src/frogs";
import {backendApolloClient} from "@/src/apollo-client";

const MyFrogFrame: FrameHandler = async (c) => {
  const myFrog = await loadFrogForFid(c.var.interactor?.fid)
  if (myFrog !== undefined) {
    console.log("Frog exists", myFrog)
    return c.res({
      image: <div style={{display: "flex"}}>
        <img src={myFrog.imageUrl} alt={myFrog.species} height={400} width={400}/>
      </div>,
      intents: [
        <Button value="frog" action="/frog/1">My Frog</Button>,
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
export default MyFrogFrame