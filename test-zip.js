const AdmZip = require("adm-zip");
const zip = new AdmZip("modules/demo/sgo-demo-v1.0.2.zip");
zip.getEntries().forEach(e => console.log(e.entryName));
