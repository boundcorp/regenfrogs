import fs from "fs";

export const NEXT_PUBLIC_URL = fs.readFileSync("/app/frontend/.env.hostname").toString().trim()
export function fixUrls(text: string) {
  return text.replaceAll(/http(s)?:\/\/[^\/]+\/frames/g, NEXT_PUBLIC_URL + '/frames')
}