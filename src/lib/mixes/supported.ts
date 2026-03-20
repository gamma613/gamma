export const MIX_ART_TYPES = ["cover"] as const;
export type MixArtType = (typeof MIX_ART_TYPES)[number];

// Preferred order: try modern formats first, then widely supported ones.
export const MIX_ART_EXTS = ["avif", "webp", "png", "jpg", "jpeg"] as const;
export type MixArtExt = (typeof MIX_ART_EXTS)[number];

// Preferred order: highest quality first, then common web audio formats.
export const MIX_AUDIO_EXTS = ["flac", "wav", "mp3"] as const;
export type MixAudioExt = (typeof MIX_AUDIO_EXTS)[number];

export function imageContentTypeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

export function audioContentTypeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "flac":
      return "audio/flac";
    case "m4a":
      return "audio/mp4";
    case "aac":
      return "audio/aac";
    case "ogg":
      return "audio/ogg";
    case "opus":
      return "audio/opus";
    default:
      return "application/octet-stream";
  }
}
