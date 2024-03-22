import {Maybe} from "@graphql-tools/utils";

export function toBase64(str: string) {
  return typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);
}

export function toRelayId(type: string, id: string) {
  return toBase64(`${type}:${id}`);
}
export function fromRelayId(relayId: string) {
  const [type, id] = atob(relayId).split(':');
  return { type, id };
}

export function filterNonNull<T>(values: Maybe<T>[]) {
  return values.filter((v) => v !== null && v !== undefined) as T[]
}

export function getNodes<T>(edges: Maybe<{ node?: Maybe<T> }>[]) {
  return filterNonNull(edges?.map((e) => e?.node) || [])
}