import Dexie from 'dexie';

class StatsDatabase extends Dexie {
  constructor() {
    super('StatsTracker');
    this.version(1).stores({
      stats: '++id, name, value, date, category'
    });
  }

  // Method to add a new stat
  async addStat(stat) {
    return await this.stats.add(stat);
  }

  // Method to get all stats
  async getAllStats() {
    return await this.stats.toArray();
  }

  // Method to get stats by category
  async getStatsByCategory(category) {
    return await this.stats.where('category').equals(category).toArray();
  }

  // Method to delete a stat
  async deleteStat(id) {
    return await this.stats.delete(id);
  }

  // Method to update a stat
  async updateStat(id, stat) {
    return await this.stats.update(id, stat);
  }
}

const db = new StatsDatabase();
export default db;