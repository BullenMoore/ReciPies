export function normalizePath(path = "") {
    return path.replace(/^\/+|\/+$/g, "");
}

export function encodePath(path = "") {
    return normalizePath(path)
        .split("/")
        .filter(Boolean)
        .map(segment => encodeURIComponent(segment))
        .join("/");
}