import { getApp } from "../../userbase";

export default async function handler(request: Request) {
   return (await getApp()).fetch(request);
}
