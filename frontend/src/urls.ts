export function fixUrls(text: string) {
  return text.replaceAll(/http(s)?:\/\/[^\/]+\/frames/g, process.env.NEXT_PUBLIC_URL + '/frames')
}