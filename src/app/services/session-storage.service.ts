import { Injectable, HostListener } from '@angular/core';

@Injectable()
export class SessionStorageService  {
    constructor() {

    }

    /**
     * Add the value to local storage
     * @param key - local storage key
     * @param value  - local storage value
     */
    public setItem(key: string, value: any) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Retrieve value from local storage based on key
     * @param key - local storage key
     */
    public getItem<T>(key: string){
        const item = sessionStorage.getItem(key);
        if(!item) {
            return null;
        }
        return JSON.parse(item) as T;
    }

    /**
     * Clear all the values from local storage
     */
    public clearAll(){
        sessionStorage.clear();
    }

    /**
     * Remove a specific item from local storage using key
     * @param key - local storage key
     */
    public removeItem (key: string) {
        sessionStorage.removeItem(key);
    }

    /**
     * Get the local storage max length
     */
    public maxLength () : number {
        return sessionStorage.length;
    }
}
