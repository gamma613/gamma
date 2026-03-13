import { Metadata } from "next";

export const NOT_FOUND_TITLE = 'Nope'

export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
};

export default function NotFound() {
  return <>
    {"Haven't made that one yet!"}
  </>
}