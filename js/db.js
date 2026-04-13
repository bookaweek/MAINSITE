const db = {
    name: 'SignariumDB',
    version: 1,
    instance: null,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.instance = request.result;
                resolve(this.instance);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('signs')) {
                    db.createObjectStore('signs', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('collections')) {
                    db.createObjectStore('collections', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('videos')) {
                    db.createObjectStore('videos', { keyPath: 'signId' });
                }
            };
        });
    },

    async getAll(storeName) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.instance.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async put(storeName, data) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.instance.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            
            if (Array.isArray(data)) {
                data.forEach(item => store.put(item));
            } else {
                store.put(data);
            }
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    },

    async delete(storeName, id) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.instance.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};

db.init().then(() => console.log('Database ready'));
