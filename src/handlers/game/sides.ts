export const SIDE_WHITE = "white";
export const SIDE_BLACK = "black";
export const SIDE_RANDOM = "random";
export const SIDES = [SIDE_WHITE, SIDE_BLACK, SIDE_RANDOM];
export type Side = "white" | "black";

export function opposite(side: Side) {
  return side === SIDE_WHITE ? SIDE_BLACK : SIDE_WHITE;
}
