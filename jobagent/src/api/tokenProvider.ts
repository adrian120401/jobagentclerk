let getTokenAsync: (() => Promise<string | null>) | null = null;

export function setTokenProvider(fn: () => Promise<string | null>) {
    getTokenAsync = fn;
}

export async function getTokenFromProvider(): Promise<string | null> {
    if (!getTokenAsync) return null;
    return getTokenAsync();
}
