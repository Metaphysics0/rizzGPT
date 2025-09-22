interface MediaCacheItem {
  fileName: string;
  url: string;
  isVideo: boolean;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class MediaCacheStore {
  private cache = $state<Record<string, MediaCacheItem>>({});

  set(fileName: string, url: string, isVideo: boolean) {
    this.cache[fileName] = {
      fileName,
      url,
      isVideo,
      timestamp: Date.now()
    };
  }

  get(fileName: string): MediaCacheItem | null {
    const item = this.cache[fileName];
    if (item && (Date.now() - item.timestamp < CACHE_DURATION)) {
      return item;
    } else if (item) {
      // Remove expired item
      delete this.cache[fileName];
    }
    return null;
  }

  clear() {
    this.cache = {};
  }
}

export const imagePreview = $state<string | null>("");
export const mediaCache = new MediaCacheStore();
