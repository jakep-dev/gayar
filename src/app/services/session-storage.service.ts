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
        localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Retrieve value from local storage based on key
     * @param key - local storage key
     */
    public getItem<T>(key: string){
        const item = localStorage.getItem(key);
        if(!item) {
            return null;
        }
        return JSON.parse(item) as T;
    }

    /**
     * Clear all the values from local storage
     */
    public clearAll(){
        localStorage.clear();
    }

    /**
     * Remove a specific item from local storage using key
     * @param key - local storage key
     */
    public removeItem (key: string) {
        localStorage.removeItem(key);
    }

    /**
     * Get the local storage max length
     */
    public maxLength () : number {
        return localStorage.length;
    }
}