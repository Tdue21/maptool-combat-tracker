/**
 * DataStorage - Object-Oriented Database Management System for MapTool
 * 
 * Provides a very simple OODBMS interface over MapTool's getLibProperty/setLibProperty functions.
 * Each catalog is stored as a JSON object in a library property, where objects are indexed by key.
 */
class DataStorage {
    
    /**
     * Get a specific object from a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @param {string} objectKey - The key of the object within the catalog
     * @param {*} defaultValue - Default value to return if object doesn't exist
     * @returns {*} The stored object or defaultValue
     */
    getObject(catalogName, objectKey, defaultValue = null) {
        try {
            const catalog = this.getCatalog(catalogName);
            return catalog.hasOwnProperty(objectKey) ? catalog[objectKey] : defaultValue;
        } catch (error) {
            handleException(error);
            return defaultValue;
        }
    }

    /**
     * Set/update a specific object in a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @param {string} objectKey - The key of the object within the catalog
     * @param {*} objectData - The data to store
     * @returns {boolean} Success status
     */
    setObject(catalogName, objectKey, objectData) {
        try {
            let catalog = this.getCatalog(catalogName);
            catalog[objectKey] = objectData;
            return this.setCatalog(catalogName, catalog);
        } catch (error) {
            handleException(error);
            return false;
        }
    }

    /**
     * Delete a specific object from a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @param {string} objectKey - The key of the object to delete
     * @returns {boolean} Success status
     */
    deleteObject(catalogName, objectKey) {
        try {
            let catalog = this.getCatalog(catalogName);
            if (catalog.hasOwnProperty(objectKey)) {
                delete catalog[objectKey];
                return this.setCatalog(catalogName, catalog);
            }
            return true; // Already doesn't exist
        } catch (error) {
            handleException(error);
            return false;
        }
    }

    /**
     * Check if an object exists in a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @param {string} objectKey - The key of the object to check
     * @returns {boolean} True if object exists
     */
    hasObject(catalogName, objectKey) {
        try {
            const catalog = this.getCatalog(catalogName);
            return catalog.hasOwnProperty(objectKey);
        } catch (error) {
            handleException(error);
            return false;
        }
    }

    /**
     * Find objects in a catalog matching a predicate function
     * @param {string} catalogName - The name of the catalog (library property)
     * @param {Function} predicate - Function that takes (value, key) and returns boolean
     * @returns {Object} Object containing matching key-value pairs
     */
    findObjects(catalogName, predicate) {
        try {
            const catalog = this.getCatalog(catalogName);
            const results = {};
            
            for (const [key, value] of Object.entries(catalog)) {
                if (predicate(value, key)) {
                    results[key] = value;
                }
            }
            
            return results;
        } catch (error) {
            handleException(error);
            return {};
        }
    }

    /**
     * Update multiple objects in a catalog using a transformation function
     * @param {string} catalogName - The name of the catalog (library property)
     * @param {Function} transformer - Function that takes (value, key) and returns new value
     * @param {Function} filter - Optional filter function to select which objects to update
     * @returns {boolean} Success status
     */
    updateObjects(catalogName, transformer, filter = null) {
        try {
            let catalog = this.getCatalog(catalogName);
            let hasChanges = false;
            
            for (const [key, value] of Object.entries(catalog)) {
                if (!filter || filter(value, key)) {
                    const newValue = transformer(value, key);
                    if (newValue !== value) {
                        catalog[key] = newValue;
                        hasChanges = true;
                    }
                }
            }
            
            return hasChanges ? this.setCatalog(catalogName, catalog) : true;
        } catch (error) {
            handleException(error);
            return false;
        }
    }

    /**
     * Get all objects from a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @returns {Object} The entire catalog as an object
     */
    getCatalog(catalogName) {
        try {
            MTScript.setVariable("name", catalogName);
            MTScript.setVariable("ns", getNamespace());
            
            const rawData = MTScript.evalMacro("[r:getLibProperty(name, ns)]");
            
            // Handle empty/non-existent tables
            if (!rawData || rawData.trim() === "" || rawData.trim() === "[]") {
                return {};
            }
            
            return JSON.parse(rawData);
        } catch (error) {
            // If parsing fails or property doesn't exist, return empty table
            return {};
        }
    }

    /**
     * Set/replace an entire catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @param {Object} catalogData - The catalog data to store
     * @returns {boolean} Success status
     */
    setCatalog(catalogName, catalogData) {
        try {
            MTScript.setVariable("name", catalogName);
            MTScript.setVariable("ns", getNamespace());
            MTScript.setVariable("data", JSON.stringify(catalogData));
            
            MTScript.evalMacro("[h:setLibProperty(name, data, ns)]");
            return true;
        } catch (error) {
            handleException(error);
            return false;
        }
    }

    /**
     * Delete an entire catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @returns {boolean} Success status
     */
    deleteCatalog(catalogName) {
        try {
            return this.setCatalog(catalogName, {});
        } catch (error) {
            handleException(error);
            return false;
        }
    }

    /**
     * Get all keys from a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @returns {string[]} Array of object keys
     */
    getObjectKeys(catalogName) {
        try {
            const catalog = this.getCatalog(catalogName);
            return Object.keys(catalog);
        } catch (error) {
            handleException(error);
            return [];
        }
    }

    /**
     * Get all values from a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @returns {Array} Array of object values
     */
    getObjectValues(catalogName) {
        try {
            const catalog = this.getCatalog(catalogName);
            return Object.values(catalog);
        } catch (error) {
            handleException(error);
            return [];
        }
    }

    /**
     * Get the count of objects in a catalog
     * @param {string} catalogName - The name of the catalog (library property)
     * @returns {number} Number of objects in the catalog
     */
    getObjectCount(catalogName) {
        try {
            const catalog = this.getCatalog(catalogName);
            return Object.keys(catalog).length;
        } catch (error) {
            handleException(error);
            return 0;
        }
    }

    /**
     * Get a list of all catalog names (library properties) that exist
     * @returns {string[]} Array of catalog names
     */
    getCatalogNames() {
        try {
            MTScript.setVariable("ns", getNamespace());
            const rawResult = MTScript.evalMacro("[r:getLibPropertyNames(ns, 'json')]");
            
            if (!rawResult || rawResult.trim() === "" || rawResult.trim() === "[]") {
                return [];
            }
            
            return JSON.parse(rawResult);
        } catch (error) {
            handleException(error);
            return [];
        }
    }

    /**
     * Backup a catalog to another catalog name
     * @param {string} sourceCatalog - Source catalog name
     * @param {string} backupCatalog - Backup catalog name
     * @returns {boolean} Success status
     */
    backupCatalog(sourceCatalog, backupCatalog) {
        try {
            const catalogData = this.getCatalog(sourceCatalog);
            return this.setCatalog(backupCatalog, catalogData);
        } catch (error) {
            handleException(error);
            return false;
        }
    }

    /**
     * Merge objects from one catalog into another
     * @param {string} sourceCatalog - Source catalog name
     * @param {string} targetCatalog - Target catalog name
     * @param {boolean} overwrite - Whether to overwrite existing keys in target
     * @returns {boolean} Success status
     */
    mergeCatalogs(sourceCatalog, targetCatalog, overwrite = false) {
        try {
            const source = this.getCatalog(sourceCatalog);
            let target = this.getCatalog(targetCatalog);
            
            for (const [key, value] of Object.entries(source)) {
                if (overwrite || !target.hasOwnProperty(key)) {
                    target[key] = value;
                }
            }
            
            return this.setCatalog(targetCatalog, target);
        } catch (error) {
            handleException(error);
            return false;
        }
    }
}

// Create global instance for easy access
const dataStorage = new DataStorage();

// Register key methods as MTScript macros for direct access from MTScript
MTScript.registerMacro("db.getObject", dataStorage.getObject.bind(dataStorage));
MTScript.registerMacro("db.setObject", dataStorage.setObject.bind(dataStorage));
MTScript.registerMacro("db.deleteObject", dataStorage.deleteObject.bind(dataStorage));
MTScript.registerMacro("db.hasObject", dataStorage.hasObject.bind(dataStorage));
MTScript.registerMacro("db.findObjects", dataStorage.findObjects.bind(dataStorage));

MTScript.registerMacro("db.getCatalog", dataStorage.getCatalog.bind(dataStorage));
MTScript.registerMacro("db.setCatalog", dataStorage.setCatalog.bind(dataStorage));
MTScript.registerMacro("db.deleteCatalog", dataStorage.deleteCatalog.bind(dataStorage));

MTScript.registerMacro("db.getObjectKeys", dataStorage.getObjectKeys.bind(dataStorage));
MTScript.registerMacro("db.getObjectValues", dataStorage.getObjectValues.bind(dataStorage));
MTScript.registerMacro("db.getObjectCount", dataStorage.getObjectCount.bind(dataStorage));
MTScript.registerMacro("db.getCatalogNames", dataStorage.getCatalogNames.bind(dataStorage));