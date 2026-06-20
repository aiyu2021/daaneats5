import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "yodeling-runway-9bndl",
  appId: "1:1088400114914:web:172f27fe0437f0dac08abb",
  apiKey: "AIzaSyB3bgV0_Y7ZytKSELMktKwmNF11KuglJsM",
  authDomain: "yodeling-runway-9bndl.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-a2840a83-d44e-4746-b626-7fd36ff7bef3",
  storageBucket: "yodeling-runway-9bndl.firebasestorage.app",
  messagingSenderId: "1088400114914"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("Firebase initialized with project id:", firebaseConfig.projectId);
