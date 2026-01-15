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
            this._validateCatalogName(catalogName);
            this._validateObjectKey(objectKey);
            const catalog = this.getCatalog(catalogName);
            const value = Object.prototype.hasOwnProperty.call(catalog, objectKey) ? catalog[objectKey] : defaultValue;
            return this._deepClone(value);
        } catch (error) {
            this._handleException("Error getting object", error);
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
            this._validateCatalogName(catalogName);
            this._validateObjectKey(objectKey);
            let catalog = this.getCatalog(catalogName);
            catalog[objectKey] = objectData;
            return this.setCatalog(catalogName, catalog);
        } catch (error) {
            this._handleException("Error setting object", error);
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
            this._validateCatalogName(catalogName);
            this._validateObjectKey(objectKey);
            let catalog = this.getCatalog(catalogName);
            if (Object.prototype.hasOwnProperty.call(catalog, objectKey)) {
                delete catalog[objectKey];
                return this.setCatalog(catalogName, catalog);
            }
            return true; // Already doesn't exist
        } catch (error) {
            this._handleException("Error deleting object", error);
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
            this._validateCatalogName(catalogName);
            this._validateObjectKey(objectKey);
            const catalog = this.getCatalog(catalogName);
            return Object.prototype.hasOwnProperty.call(catalog, objectKey);
        } catch (error) {
            this._handleException("Error checking if object exists", error);
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
            this._validateCatalogName(catalogName);
            if (typeof predicate !== 'function') {
                throw new Error('Predicate must be a function');
            }
            const catalog = this.getCatalog(catalogName);
            const results = {};
            
            for (const [key, value] of Object.entries(catalog)) {
                if (predicate(value, key)) {
                    results[key] = this._deepClone(value);
                }
            }
            
            return results;
        } catch (error) {
            this._handleException("Error finding objects", error);
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
            this._validateCatalogName(catalogName);
            if (typeof transformer !== 'function') {
                throw new Error('Transformer must be a function');
            }
            if (filter !== null && typeof filter !== 'function') {
                throw new Error('Filter must be a function or null');
            }
            let catalog = this.getCatalog(catalogName);
            let hasChanges = false;
            
            for (const [key, value] of Object.entries(catalog)) {
                if (!filter || filter(value, key)) {
                    const oldJson = JSON.stringify(value);
                    const newValue = transformer(value, key);
                    if (JSON.stringify(newValue) !== oldJson) {
                        catalog[key] = newValue;
                        hasChanges = true;
                    }
                }
            }
            
            return hasChanges ? this.setCatalog(catalogName, catalog) : true;
        } catch (error) {
            this._handleException("Error updating objects", error);
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
            this._validateCatalogName(catalogName);
            MTScript.setVariable("_ds_name", catalogName);
            MTScript.setVariable("_ds_ns", this._getNamespace());
            
            const rawData = MTScript.evalMacro("[r:getLibProperty(_ds_name, _ds_ns)]");
            
            // Handle empty/non-existent tables
            if (!rawData || rawData.trim() === "" || rawData.trim() === "{}") {
                return {};
            }
            
            return JSON.parse(rawData);
        } catch (error) {
            // If parsing fails or property doesn't exist, return empty table
            this._handleException("Error getting catalog", error);
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
            this._validateCatalogName(catalogName);
            if (catalogData === null || catalogData === undefined) {
                throw new Error('Catalog data cannot be null or undefined');
            }
            if (typeof catalogData !== 'object' || Array.isArray(catalogData)) {
                throw new Error('Catalog data must be an object');
            }
            
            const jsonData = JSON.stringify(catalogData);
            this._validateDataSize(jsonData);
            
            MTScript.setVariable("_ds_name", catalogName);
            MTScript.setVariable("_ds_ns", this._getNamespace());
            MTScript.setVariable("_ds_data", jsonData);
            
            MTScript.evalMacro("[h:setLibProperty(_ds_name, _ds_data, _ds_ns)]");
            return true;
        } catch (error) {
            this._handleException("Error setting catalog", error);
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
            this._validateCatalogName(catalogName);
            return this.setCatalog(catalogName, {});
        } catch (error) {
            this._handleException("Error deleting catalog", error);
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
            this._validateCatalogName(catalogName);
            const catalog = this.getCatalog(catalogName);
            return Object.keys(catalog);
        } catch (error) {
            this._handleException("Error getting object keys", error);
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
            this._validateCatalogName(catalogName);
            const catalog = this.getCatalog(catalogName);
            return Object.values(catalog);
        } catch (error) {
            this._handleException("Error getting object values", error);
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
            this._validateCatalogName(catalogName);
            const catalog = this.getCatalog(catalogName);
            return Object.keys(catalog).length;
        } catch (error) {
            this._handleException("Error getting object count", error);
            return 0;
        }
    }

    /**
     * Get a list of all catalog names (library properties) that exist
     * @returns {string[]} Array of catalog names
     */
    getCatalogNames() {
        try {
            MTScript.setVariable("_ds_ns", this._getNamespace());
            const rawResult = MTScript.evalMacro("[r:getLibPropertyNames(_ds_ns, 'json')]");
            
            if (!rawResult || rawResult.trim() === "" || rawResult.trim() === "[]") {
                return [];
            }
            
            return JSON.parse(rawResult);
        } catch (error) {
            this._handleException("Error getting catalog names", error);
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
            this._validateCatalogName(sourceCatalog);
            this._validateCatalogName(backupCatalog);
            const catalogData = this.getCatalog(sourceCatalog);
            return this.setCatalog(backupCatalog, catalogData);
        } catch (error) {
            this._handleException("Error backing up catalog", error);
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
            this._validateCatalogName(sourceCatalog);
            this._validateCatalogName(targetCatalog);
            const source = this.getCatalog(sourceCatalog);
            let target = this.getCatalog(targetCatalog);
            
            for (const [key, value] of Object.entries(source)) {
                if (overwrite || !Object.prototype.hasOwnProperty.call(target, key)) {
                    target[key] = value;
                }
            }
            
            return this.setCatalog(targetCatalog, target);
        } catch (error) {
            this._handleException("Error merging catalogs", error);
            return false;
        }
    }

    /**
     * Validate a catalog name
     * @param {string} catalogName - The catalog name to validate
     * @throws {Error} If catalog name is invalid
     * @private
     */
    _validateCatalogName(catalogName) {
        if (catalogName === null || catalogName === undefined) {
            throw new Error('Catalog name cannot be null or undefined');
        }
        if (typeof catalogName !== 'string') {
            throw new Error('Catalog name must be a string');
        }
        if (catalogName.trim() === '') {
            throw new Error('Catalog name cannot be empty');
        }
        // Check for invalid characters that might break MTScript
        if (/[\[\]{}"'\\]/.test(catalogName)) {
            throw new Error('Catalog name contains invalid characters: []{}"\'\\');
        }
    }

    /**
     * Validate an object key
     * @param {string} objectKey - The object key to validate
     * @throws {Error} If object key is invalid
     * @private
     */
    _validateObjectKey(objectKey) {
        if (objectKey === null || objectKey === undefined) {
            throw new Error('Object key cannot be null or undefined');
        }
        if (typeof objectKey !== 'string') {
            throw new Error('Object key must be a string');
        }
        if (objectKey.trim() === '') {
            throw new Error('Object key cannot be empty');
        }
    }

    /**
     * Validate data size to prevent excessive memory usage
     * @param {string} jsonData - The JSON stringified data
     * @throws {Error} If data exceeds size limit
     * @private
     */
    _validateDataSize(jsonData) {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit
        const size = jsonData.length;
        if (size > MAX_SIZE) {
            throw new Error(`Catalog data size (${(size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (10MB)`);
        }
    }

    /**
     * Deep clone an object to prevent mutation of stored data
     * @param {*} obj - Object to clone
     * @returns {*} Deep cloned object
     * @private
     */
    _deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 
     * @returns 
     */
    _getNamespace() {
        MTScript.execMacro(`[h:_ds_ns = replace(getMacroLocation(), "lib:", "")]`);
        const ns = MTScript.getVariable("_ds_ns");
        return ns;
    }

    /**
     * 
     * @param {*} message 
     * @param {*} error 
     */
    _handleException(message, error) {
        MapTool.chat.broadcast(`${message} Error:
            Message: ${error.message}
            Stack: ${error.stack}`);
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
MTScript.registerMacro("db.updateObjects", dataStorage.updateObjects.bind(dataStorage));

MTScript.registerMacro("db.getCatalog", dataStorage.getCatalog.bind(dataStorage));
MTScript.registerMacro("db.setCatalog", dataStorage.setCatalog.bind(dataStorage));
MTScript.registerMacro("db.deleteCatalog", dataStorage.deleteCatalog.bind(dataStorage));
MTScript.registerMacro("db.backupCatalog", dataStorage.backupCatalog.bind(dataStorage));
MTScript.registerMacro("db.mergeCatalogs", dataStorage.mergeCatalogs.bind(dataStorage));

MTScript.registerMacro("db.getObjectKeys", dataStorage.getObjectKeys.bind(dataStorage));
MTScript.registerMacro("db.getObjectValues", dataStorage.getObjectValues.bind(dataStorage));
MTScript.registerMacro("db.getObjectCount", dataStorage.getObjectCount.bind(dataStorage));
MTScript.registerMacro("db.getCatalogNames", dataStorage.getCatalogNames.bind(dataStorage));