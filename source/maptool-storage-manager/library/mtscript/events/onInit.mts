[h:ns = replace(getMacroLocation(), "lib:", "")]
[h:broadcast("Namespace: " + ns + " initializing...")]

[h:js.createNS(ns, true)]
[h:js.evalUri(ns, "lib://" + ns + "/DataStorage.js?cachelib=false")]

[h:broadcast("Namespace: " + ns + " initialized.")]
