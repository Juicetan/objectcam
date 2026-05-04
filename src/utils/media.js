

export const closeMediaStream = (stream) => {
  stream.getTracks().forEach((t) => t.stop());
}