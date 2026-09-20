import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
    apiKey: "AIzaSyAzP5_cqEl40eldTiiR6FPPO2tBVpxrBk0",
    authDomain: "directorio-paisa.firebaseapp.com",
    projectId: "directorio-paisa",
    storageBucket: "directorio-paisa.firebasestorage.app",
    messagingSenderId: "743750203663",
    appId: "1:743750203663:web:ef0cefedb499330699e67a",
    measurementId: "G-S50VSB4YS0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportCollection() {
  try {
    const querySnapshot = await getDocs(collection(db, "negocios"));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    fs.writeFileSync("negocios_backup.json", JSON.stringify(data, null, 2));
    console.log(`Successfully exported ${data.length} documents to negocios_backup.json`);
    process.exit(0);
  } catch (error) {
    console.error("Error exporting collection:", error);
    process.exit(1);
  }
}

exportCollection();
