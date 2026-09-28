import { PROPERTY } from '@/data/propertyFacts';

// LINE OA "message" deep link: opens a chat with `text` pre-filled in the
// input box (not sent) — the visitor still taps send, which is also what
// adds Nature Haven as a friend for a visitor who isn't one yet. Uses the
// same permanent OA id as PROPERTY.lineUrl (the plain add-friend link).
export function lineMessageUrl(text: string): string {
  return `https://line.me/R/oaMessage/${PROPERTY.lineId}/?${encodeURIComponent(text)}`;
}
