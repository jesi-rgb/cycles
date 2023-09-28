import { goto } from "$app/navigation";

export function routeToPage(route) {
  goto(route, { replaceState: true });
}
