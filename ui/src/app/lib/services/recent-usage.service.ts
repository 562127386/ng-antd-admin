import { Injectable } from '@angular/core';

interface RecentItem {
  id: string | number;
  label: string;
  entityName: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecentUsageService {
  private readonly STORAGE_KEY = 'abp_dynamic_form_recent_items';
  private readonly MAX_ITEMS = 10;

  constructor() {}

  /**
   * Add an item to recent usage
   * @param id Item ID
   * @param label Item label
   * @param entityName Entity name
   */
  addRecentItem(id: string | number, label: string, entityName: string): void {
    const recentItems = this.getRecentItems();
    
    // Remove if already exists
    const filteredItems = recentItems.filter(item => 
      !(item.id === id && item.entityName === entityName)
    );
    
    // Add to beginning
    const newItem: RecentItem = {
      id,
      label,
      entityName,
      timestamp: Date.now()
    };
    
    filteredItems.unshift(newItem);
    
    // Keep only MAX_ITEMS
    const limitedItems = filteredItems.slice(0, this.MAX_ITEMS);
    
    this.saveRecentItems(limitedItems);
  }

  /**
   * Get recent items for a specific entity
   * @param entityName Entity name
   * @param limit Maximum number of items to return
   */
  getRecentItemsForEntity(entityName: string, limit: number = 5): RecentItem[] {
    const recentItems = this.getRecentItems();
    return recentItems
      .filter(item => item.entityName === entityName)
      .slice(0, limit);
  }

  /**
   * Clear recent items for a specific entity
   * @param entityName Entity name
   */
  clearRecentItemsForEntity(entityName: string): void {
    const recentItems = this.getRecentItems();
    const filteredItems = recentItems.filter(item => item.entityName !== entityName);
    this.saveRecentItems(filteredItems);
  }

  /**
   * Clear all recent items
   */
  clearAllRecentItems(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get all recent items
   */
  private getRecentItems(): RecentItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recent items:', error);
      return [];
    }
  }

  /**
   * Save recent items to storage
   * @param items Recent items to save
   */
  private saveRecentItems(items: RecentItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving recent items:', error);
    }
  }
}
