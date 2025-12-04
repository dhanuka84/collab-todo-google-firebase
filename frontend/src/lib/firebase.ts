import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Hard-coded config for your project
const firebaseConfig = {
    apiKey: "AIzaSyBeHC-Fj7hkxLSlM_9bI0gCNISaNn058Hk",
    authDomain: "my-first-firebase-721a1.firebaseapp.com",
    projectId: "my-first-firebase-721a1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
