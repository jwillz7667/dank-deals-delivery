import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default async function Handler(props: unknown) {
  const component = await StackHandler({
    fullPage: true,
    app: stackServerApp,
    routeProps: props,
  });
  return component;
}
