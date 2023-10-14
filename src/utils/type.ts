export const isVideoURL = (url: string) => {
  return ['.mp4', '.3gp', '.m3u8', 'webm'].some((suffix) => url.endsWith(suffix));
};
