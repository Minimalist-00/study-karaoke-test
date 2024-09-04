const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};
// Initialize Firebase
export let firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];
export function initFirebase() {
  firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApps()[0];
}
// const analytics = getAnalytics(firebaseApp);
