// Clareira: nuvem (Firebase) + recursos do app Android (Capacitor)
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/700.css';
import '@fontsource/hanken-grotesk/400.css';
import '@fontsource/hanken-grotesk/500.css';
import '@fontsource/hanken-grotesk/700.css';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut
} from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const firebaseConfig = {
  apiKey: 'AIzaSyCx5Tedp5nv44B9NNO6W0H9jg9IOldsTfU',
  authDomain: 'clareira-91c57.firebaseapp.com',
  projectId: 'clareira-91c57',
  storageBucket: 'clareira-91c57.firebasestorage.app',
  messagingSenderId: '948461449117',
  appId: '1:948461449117:web:d16dea8abcc71142bac974'
};

const isNative = Capacitor.isNativePlatform();

/* ---------- alarmes nativos (Android) ---------- */
let prepared = false;
async function prepare() {
  if (prepared) return;
  prepared = true;
  try {
    const p = await LocalNotifications.checkPermissions();
    if (p.display !== 'granted') await LocalNotifications.requestPermissions();
  } catch (e) { /* sem permissão: os avisos não aparecem */ }
  try {
    await LocalNotifications.createChannel({ id: 'alarmes', name: 'Alarmes e compromissos', importance: 5, visibility: 1, vibration: true });
  } catch (e) { /* canal já existe */ }
}
window.ClareiraNative = {
  isNative,
  async schedule(list) {
    if (!isNative) return;
    try {
      await prepare();
      const pend = await LocalNotifications.getPending();
      if (pend.notifications.length) await LocalNotifications.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
      if (!list.length) return;
      await LocalNotifications.schedule({
        notifications: list.map((n, i) => ({
          id: i + 1, title: n.title, body: n.body, channelId: 'alarmes',
          schedule: { at: new Date(n.at), allowWhileIdle: true }
        }))
      });
    } catch (e) { console.warn('Clareira: falha ao agendar alarmes', e); }
  },
  async openExact() {
    try { await LocalNotifications.changeExactNotificationSetting(); } catch (e) { /* versões antigas do Android não precisam */ }
  }
};
if (isNative) window.dispatchEvent(new Event('clareira-native'));

/* ---------- site instalável e offline (computador) ---------- */
if (!isNative && 'serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

/* ---------- nuvem ---------- */
const ERR = {
  'auth/invalid-email': 'Esse e-mail não parece válido.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Não existe conta com esse e-mail. Toque em Criar conta.',
  'auth/missing-password': 'Digite a senha.',
  'auth/email-already-in-use': 'Já existe uma conta com esse e-mail. Toque em Entrar.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Sem internet. Conecte-se para entrar.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Espere alguns minutos.',
  'auth/operation-not-allowed': 'O login por e-mail não está ativado no Firebase (passo 1 do guia).'
};
const friendly = e => new Error(ERR[e && e.code] || 'Não consegui concluir. Tente de novo.');

try {
  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
  let db;
  try { db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
  catch (e) { db = initializeFirestore(app, {}); }
  const ref = (uid, k) => doc(db, 'users', uid, 'clareira', k);

  window.ClareiraCloud = {
    onAuth: cb => onAuthStateChanged(auth, u => cb(u ? { uid: u.uid, email: u.email } : null)),
    signIn: (em, pw) => signInWithEmailAndPassword(auth, em, pw).catch(e => { throw friendly(e); }),
    signUp: (em, pw) => createUserWithEmailAndPassword(auth, em, pw).catch(e => { throw friendly(e); }),
    reset: em => sendPasswordResetEmail(auth, em).catch(e => { throw friendly(e); }),
    signOut: () => signOut(auth),
    sub: (uid, k, next, err) => onSnapshot(ref(uid, k), { includeMetadataChanges: true },
      s => next({ exists: s.exists(), data: () => s.data(), metadata: { fromCache: s.metadata.fromCache, hasPendingWrites: s.metadata.hasPendingWrites } }),
      e => err && err({ code: e.code === 'permission-denied' ? 'denied' : 'unavailable', message: e.message })),
    set: (uid, k, data) => setDoc(ref(uid, k), data).catch(e => { throw { code: e.code === 'permission-denied' ? 'denied' : 'unavailable' }; })
  };
  window.dispatchEvent(new Event('clareira-cloud'));
} catch (e) {
  console.warn('Clareira: nuvem indisponível', e);
}
