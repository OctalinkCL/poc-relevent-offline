import { ref } from 'vue'
import { db } from '@/db.js'
import { database } from '@/firebase.js'
import { ref as dbRef, push } from 'firebase/database'

export function useRegistro() {
  const loading = ref(false)

  async function registrar(persona, conKit, dispositivo = 'manual') {
    loading.value = true
    const registro = {
      rut: persona.rut,
      nombre: persona.nombre,
      timestamp: Date.now(),
      dispositivo,
      kit: conKit,
    }
    await db.registros.add(registro)
    push(dbRef(database, 'registros'), registro).catch(() => {})
    loading.value = false
  }

  return { loading, registrar }
}
