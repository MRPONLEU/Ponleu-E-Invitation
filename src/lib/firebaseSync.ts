import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firebaseUtils';

const writeTimeouts = new Map<string, NodeJS.Timeout>();
let isQuotaExceeded = false;

// Helper to save to local cache
export function saveToLocalCache<T>(collectionName: string, data: T[]) {
  try {
    localStorage.setItem(`app_cached_${collectionName}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not cache ${collectionName} locally:`, e);
  }
}

// Helper to read from local cache
export function getFromLocalCache<T>(collectionName: string): T[] | null {
  try {
    const raw = localStorage.getItem(`app_cached_${collectionName}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as T[];
      }
    }
  } catch (e) {
    console.warn(`Could not read ${collectionName} from local cache:`, e);
  }
  return null;
}

export function syncCollectionToFirestore<T extends { id: string }>(
  collectionName: string,
  prev: T[],
  next: T[]
) {
  // Always update local cache immediately so no changes are lost
  saveToLocalCache(collectionName, next);

  if (isQuotaExceeded) {
    // If daily write quota is already reached, keep saving locally without spamming network
    return;
  }

  // Find added or updated items
  for (const item of next) {
    const prevItem = prev.find(p => p.id === item.id);
    if (!prevItem || JSON.stringify(prevItem) !== JSON.stringify(item)) {
      const docPath = `${collectionName}/${item.id}`;
      
      if (writeTimeouts.has(docPath)) {
        clearTimeout(writeTimeouts.get(docPath)!);
      }
      
      const timeout = setTimeout(() => {
        setDoc(doc(db, collectionName, item.id), item).catch(err => {
          const msg = err?.message || String(err);
          const isQuota = (err as any)?.code === 'resource-exhausted' || 
                          msg.includes('resource-exhausted') || 
                          msg.includes('Quota') ||
                          msg.includes('Write stream exhausted');
          
          if (isQuota) {
            isQuotaExceeded = true;
            console.warn(`Firestore free daily write quota reached. Changes are saved locally in browser.`);
          } else if (msg.toLowerCase().includes('permission') || (err as any)?.code === 'permission-denied') {
            handleFirestoreError(err, OperationType.WRITE, docPath);
          } else {
            console.warn(`Firestore write note for ${docPath}:`, msg);
          }
        });
        writeTimeouts.delete(docPath);
      }, 1000);
      
      writeTimeouts.set(docPath, timeout);
    }
  }

  // Find removed items
  for (const prevItem of prev) {
    if (!next.find(n => n.id === prevItem.id)) {
      deleteDoc(doc(db, collectionName, prevItem.id)).catch(err => {
        const msg = err?.message || String(err);
        const isQuota = (err as any)?.code === 'resource-exhausted' || 
                        msg.includes('resource-exhausted') || 
                        msg.includes('Quota');

        if (isQuota) {
          isQuotaExceeded = true;
        } else if (msg.toLowerCase().includes('permission') || (err as any)?.code === 'permission-denied') {
          handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${prevItem.id}`);
        } else {
          console.warn(`Firestore delete note for ${collectionName}/${prevItem.id}:`, msg);
        }
      });
    }
  }
}

export function subscribeToCollection<T>(
  collectionName: string,
  onData: (data: T[]) => void
) {
  // Check local cache first so initial render is instant
  const cached = getFromLocalCache<T>(collectionName);
  if (cached && cached.length > 0) {
    onData(cached);
  }

  return onSnapshot(
    collection(db, collectionName),
    (snapshot) => {
      if (!snapshot.empty) {
        const items: T[] = [];
        snapshot.forEach(doc => {
          items.push({ id: doc.id, ...doc.data() } as T);
        });
        saveToLocalCache(collectionName, items);
        onData(items);
      }
    },
    (error) => {
      const msg = error?.message || String(error);
      const isQuota = (error as any)?.code === 'resource-exhausted' || 
                      msg.includes('resource-exhausted') || 
                      msg.includes('Quota');

      if (isQuota) {
        isQuotaExceeded = true;
        console.warn(`Firestore quota limit reached. Using local data for ${collectionName}.`);
        const fallback = getFromLocalCache<T>(collectionName);
        if (fallback) {
          onData(fallback);
        }
      } else if (msg.toLowerCase().includes('permission') || (error as any)?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.GET, collectionName);
      } else {
        console.warn(`Firestore sync note for ${collectionName}:`, msg);
      }
    }
  );
}
