export async function sleep(durationInMs: number) {
    return new Promise(resolve => setTimeout(resolve, durationInMs));
}
