// YouTube avatar URLs encode their size as `=s<px>` (e.g. `=s800-c-k-c0x00ffffff-no-rj`).
// Ask for the size actually rendered instead of downloading the 800px original.
export const resizeYoutubeAvatar = (url: string, size: number) => url.replace(/=s\d+/, `=s${size}`);
