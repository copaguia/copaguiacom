const admin = require('firebase-admin');

// Initialize with application default credentials
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'copaguia-53f7f'
});

const firestore = admin.firestore();

async function run() {
  try {
    console.log('Buscando directorio niquia.com...');
    const snapshot = await firestore.collection('directorios').where('dominio', '==', 'niquia.com').get();
    
    const data = {
      dominio: 'niquia.com',
      nombre: 'Directorio Niquía',
      descripcion: 'El directorio oficial comercial de Niquía, Bello.',
      logoUrl: 'assets/brand/niquia-logo.png',
      municipio: 'Bello',
      sector: 'Niquía',
      activo: true,
      seoConfig: {
        titleTemplate: '%s | Directorio Niquía',
        metaDescription: 'Encuentra comercios y servicios en Niquía, Bello.',
        keywords: ['niquia', 'bello', 'directorio', 'comercios'],
        ogImage: 'assets/brand/niquia-logo.png',
        schemaType: 'WebSite'
      },
      tema: {
        primario: '#E81E61',
        fondo: '#000B2B',
        texto: '#FFFFFF'
      }
    };

    if (snapshot.empty) {
      console.log('Creando nuevo documento para niquia.com...');
      await firestore.collection('directorios').add(data);
      console.log('Creado exitosamente.');
    } else {
      console.log('Actualizando documento existente para niquia.com...');
      const docId = snapshot.docs[0].id;
      await firestore.collection('directorios').doc(docId).set(data, { merge: true });
      console.log('Actualizado exitosamente.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
