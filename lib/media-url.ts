/**
 * Utilitaire de normalisation d'URLs d'images pour le portfolio.
 * Convertit automatiquement les liens de partage (Google Drive, Dropbox, GitHub)
 * en liens d'images directes exploitables dans les balises <img>.
 */

export function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  const trimmed = rawUrl.trim();

  // 1. Détection Google Drive (ex: https://drive.google.com/file/d/ID/view?usp=sharing)
  if (trimmed.includes("drive.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // lh3.googleusercontent.com/d/ID est l'URL CDN directe sans en-têtes bloquants
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // 2. Détection Dropbox (ex: https://www.dropbox.com/s/.../image.png?dl=0)
  if (trimmed.includes("dropbox.com")) {
    return trimmed.replace(/[?&]dl=0/, "?raw=1");
  }

  // 3. Détection GitHub Blob -> Raw
  if (trimmed.includes("github.com") && trimmed.includes("/blob/")) {
    return trimmed
      .replace("github.com", "raw.githubusercontent.com")
      .replace("/blob/", "/");
  }

  return trimmed;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return (
    url.includes("drive.google.com") ||
    url.includes("googleusercontent.com/d/") ||
    url.includes("drive.google.com/thumbnail")
  );
}
