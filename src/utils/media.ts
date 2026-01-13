/**
 * Vérifie si une URL pointe vers un fichier vidéo
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false
  
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v']
  const lowerUrl = url.toLowerCase()
  
  return videoExtensions.some(ext => lowerUrl.includes(ext))
}

/**
 * Vérifie si une URL pointe vers un fichier image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.bmp']
  const lowerUrl = url.toLowerCase()
  
  return imageExtensions.some(ext => lowerUrl.includes(ext))
}

