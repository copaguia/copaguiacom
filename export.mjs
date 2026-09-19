import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
    apiKey: "AIzaSyDWfuWkDTun9xzbasmW7Y-ctevQm1i-o2k",
    authDomain: "copaguia-53f7f.firebaseapp.com",
    projectId: "copaguia-53f7f",
    storageBucket: "copaguia-53f7f.appspot.com",
    messagingSenderId: "719139766457",
    appId: "1:719139766457:web:1f75352dca7771537e1b68",
    measurementId: "G-DDJYYD9THN"
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
