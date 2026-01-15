[h:ns = replace(getMacroLocation(), "lib:", "")]
[h:js.createNS(ns, true)]
[h:js.evalUri(ns, "lib://" + ns + "/DataStorage.js?cachelib=false")]
