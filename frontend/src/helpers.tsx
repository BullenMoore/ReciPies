export function routeHelper(path: string): string {
    return `/${path.replace(/^\/+/, "")}`;
}