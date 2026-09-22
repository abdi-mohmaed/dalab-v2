import AsyncStorage from '@react-native-async-storage/async-storage';

export const cache = {
    async set(key: string, value: any, ttlSeconds: number = 3600) {
        const item = {
            value,
            expiry: Date.now() + ttlSeconds * 1000,
        };
        await AsyncStorage.setItem(key, JSON.stringify(item));
    },

    async get(key: string) {
        const jsonValue = await AsyncStorage.getItem(key);
        if (!jsonValue) return null;

        const item = JSON.parse(jsonValue);
        if (Date.now() > item.expiry) {
            await AsyncStorage.removeItem(key);
            return null;
        }

        return item.value;
    },

    async remove(key: string) {
        await AsyncStorage.removeItem(key);
    },

    async clear() {
        await AsyncStorage.clear();
    },
};
