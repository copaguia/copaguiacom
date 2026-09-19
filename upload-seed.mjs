import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Inicializar firebase-admin con las credenciales locales
const serviceAccount = JSON.parse(fs.readFileSync('./scripts/key.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = getFirestore();

async function uploadSeed() {
  try {
    const rawData = fs.readFileSync("negocios_manual_seed.json", "utf-8");
    const negocios = JSON.parse(rawData);
    
    console.log(`Iniciando subida de ${negocios.length} negocios a negocios_borrador...`);
    
    let count = 0;
    const total = negocios.length;
    
    // Subir en lotes (batches) de 500 para optimizar y evitar errores
    const CHUNK_SIZE = 500;
    for (let i = 0; i < total; i += CHUNK_SIZE) {
      const chunk = negocios.slice(i, i + CHUNK_SIZE);
      const batch = db.batch();
      
      for (const negocio of chunk) {
        const docId = negocio.id;
        const negocioRef = db.collection('negocios_borrador').doc(docId);
        
        // Removemos el id del payload ya que será la llave del documento
        const { id, ...payload } = negocio;
        batch.set(negocioRef, payload);
      }
      
      await batch.commit();
      count += chunk.length;
      console.log(`Progreso: ${count} / ${total}`);
    }
    
    console.log(`Completado. Se subieron ${count} documentos a negocios_borrador.`);
    process.exit(0);
  } catch (error) {
    console.error("Error subiendo colección:", error);
    process.exit(1);
  }
}

uploadSeed();
