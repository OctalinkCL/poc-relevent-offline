import Dexie from "dexie";

export const db = new Dexie("control-ingreso");

db.version(1).stores({
  personas: "rut, nombre",
  registros: "++id, rut, timestamp, dispositivo",
});

db.version(2).stores({
  personas: "rut, nombre",
  registros: "++id, rut, timestamp, dispositivo, kit",
});
