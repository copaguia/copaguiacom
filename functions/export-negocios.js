const admin = require('firebase-admin');
const fs = require('fs');

// Initialize the app with application default credentials
admin.initializeApp();

const db = admin.firestore();

async function exportCollection() {
  try {
    const snapshot = await db.collection('negocios').get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    fs.writeFileSync('../negocios_backup.json', JSON.stringify(data, null, 2));
    console.log(`Successfully exported ${data.length} documents to negocios_backup.json`);
  } catch (error) {
    console.error('Error exporting collection:', error);
  }
}

exportCollection();
