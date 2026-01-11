<!-- Setting up User Defined Functions -->
[h:prefix = "db."]
[h:this = getMacroLocation()]

[h:defineFunction(prefix+"getNamespace", "getNamespace@"+this)]
[h:defineFunction(prefix+"getCatalogs", "getCatalogs@"+this)]
[h:defineFunction(prefix+"getCatalog", "getCatalog@"+this)]

[h:defineFunction(prefix+"saveObject", "saveObject@"+this)]
[h:defineFunction(prefix+"getObject", "getObject@"+this)]
[h:defineFunction(prefix+"deleteObject", "deleteObject@"+this)]