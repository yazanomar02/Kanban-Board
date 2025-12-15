const STORAGE_KEY = 'kanban-board-data';
const STORAGE_VERSION = '1.0.0';

export const storageService = {
  getData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);

      if (parsed.version !== STORAGE_VERSION) {
        this.migrateData(parsed);
      }

      return parsed;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return null;
    }
  },

  saveData(data) {
    try {
      const saveData = {
        ...data,
        version: STORAGE_VERSION,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      return false;
    }
  },

  getColumns() {
    const data = this.getData();
    return data?.columns || [];
  },

  saveColumns(columns) {
    return this.saveData({ columns });
  },

  migrateData(oldData) {
    console.log('Migrating data from version', oldData.version, 'to', STORAGE_VERSION);

    if (!oldData.version) {
      return {
        columns: oldData.columns || oldData,
        version: STORAGE_VERSION,
      };
    }

    return oldData;
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  getStorageInfo() {
    const data = this.getData();
    if (!data) return null;

    return {
      size: JSON.stringify(data).length,
      savedAt: data.savedAt,
      version: data.version,
      columnsCount: data.columns?.length || 0,
      tasksCount: data.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) || 0,
    };
  },
};