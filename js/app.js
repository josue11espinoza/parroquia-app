// js/app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

/* ====== CONFIGURACIÓN: reemplaza con tu firebaseConfig ====== */
const firebaseConfig = {
  apiKey: "AIzaSyDSQ6b9f16NFyMp8AtFoQHUzQ6Vja5lczE",
  authDomain: "parroquia-app.firebaseapp.com",
  projectId: "parroquia-app",
  storageBucket: "parroquia-app.firebasestorage.app",
  messagingSenderId: "349946745486",
  appId: "G-W6LK6HLLGB"
};
/* ============================================================ */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* UI */
const loginForm = document.getElementById('login-form');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const userInfo = document.getElementById('user-info');
const welcome = document.getElementById('welcome');
const btnLogout = document.getElementById('btn-logout');
const panel = document.getElementById('panel');

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  try{
    await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
  }catch(err){
    alert('Error al iniciar sesión: '+err.message);
  }
});

btnLogout.addEventListener('click', ()=> signOut(auth));

onAuthStateChanged(auth, user=>{
  if(user){
    userInfo.hidden = false;
    panel.hidden = false;
    loginForm.hidden = true;
    welcome.textContent = `Bienvenido, ${user.email}`;
  } else {
    userInfo.hidden = true;
    panel.hidden = true;
    loginForm.hidden = false;
  }
});

/* Miembros: registrar y buscar */
const memberForm = document.getElementById('member-form');
const dniEl = document.getElementById('dni');
const nombreEl = document.getElementById('nombre');
const telefonoEl = document.getElementById('telefono');
const results = document.getElementById('results');
const searchDni = document.getElementById('search-dni');
const btnSearch = document.getElementById('btn-search');

memberForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  try{
    const docRef = await addDoc(collection(db, "miembros"), {
      dni: dniEl.value.trim(),
      nombre: nombreEl.value.trim(),
      telefono: telefonoEl.value.trim(),
      creadoEn: new Date().toISOString(),
      estado: "activo"
    });
    alert('Miembro registrado: ' + docRef.id);
    memberForm.reset();
  }catch(err){
    alert('Error al guardar: '+err.message);
  }
});

btnSearch.addEventListener('click', async ()=>{
  const dni = searchDni.value.trim();
  results.innerHTML = 'Buscando...';
  if(!dni){ results.innerHTML = 'Ingrese DNI'; return; }
  const q = query(collection(db, "miembros"), where("dni", "==", dni));
  const snap = await getDocs(q);
  if(snap.empty){ results.innerHTML = 'No encontrado'; return; }
  results.innerHTML = '';
  snap.forEach(doc=>{
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `<strong>${data.nombre}</strong> — DNI: ${data.dni} — Tel: ${data.telefono || '-'}`;
    results.appendChild(div);
  });
});