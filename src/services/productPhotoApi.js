const sportProductPhotos = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506629905607-d9f297d88f44?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=80"
];

export async function getRandomProductPhoto(usedPhotos = [], currentPhoto = "") {
  const usedPhotoSet = new Set(usedPhotos.filter(Boolean));
  const unusedPhotos = sportProductPhotos.filter((photo) => !usedPhotoSet.has(photo));
  const availablePhotos = unusedPhotos.length > 0
    ? unusedPhotos
    : sportProductPhotos.filter((photo) => photo !== currentPhoto);

  const photoPool = availablePhotos.length > 0 ? availablePhotos : sportProductPhotos;
  const photoIndex = Math.floor(Math.random() * photoPool.length);
  return photoPool[photoIndex];
}

export function getFallbackProductPhoto(index = 0) {
  return sportProductPhotos[index % sportProductPhotos.length];
}
