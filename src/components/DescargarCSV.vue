<template>
  <v-btn color="success" prepend-icon="mdi-download" @click="descargarCSV">
    Descargar CSV
  </v-btn>
</template>

<script setup>
import { db } from "@/db.js";

async function descargarCSV() {
  const registros = await db.registros.toArray();
  const personas = await db.personas.toArray();
  const personasPorRut = Object.fromEntries(personas.map((p) => [p.rut, p]));

  const filas = registros.map((r) => {
    const persona = personasPorRut[r.rut] ?? {};
    return [
      r.id,
      r.rut,
      persona.nombre ?? "",
      r.timestamp ? new Date(r.timestamp).toISOString() : "",
      r.dispositivo ?? "",
      r.kit ? "sí" : "no",
    ];
  });

  const encabezado = ["id", "rut", "nombre", "timestamp", "dispositivo", "kit"];
  const csv = [encabezado, ...filas]
    .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registros-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
