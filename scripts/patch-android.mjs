// Ajusta o projeto Android gerado pelo Capacitor: ícones, permissões e assinatura fixa.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const app = path.join(root, 'android', 'app');
const res = path.join(app, 'src', 'main', 'res');

// 1. ícones (copia resources/android/res por cima do padrão)
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const a = path.join(from, f), b = path.join(to, f);
    if (fs.statSync(a).isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b);
  }
}
copyDir(path.join(root, 'resources', 'android', 'res'), res);

// 2. permissões de notificação e alarme exato
const manPath = path.join(app, 'src', 'main', 'AndroidManifest.xml');
let man = fs.readFileSync(manPath, 'utf8');
const perms = ['POST_NOTIFICATIONS', 'SCHEDULE_EXACT_ALARM', 'RECEIVE_BOOT_COMPLETED', 'WAKE_LOCK', 'VIBRATE'];
for (const p of perms) {
  const tag = `<uses-permission android:name="android.permission.${p}" />`;
  if (!man.includes(`android.permission.${p}"`)) man = man.replace('</manifest>', `    ${tag}\n</manifest>`);
}
fs.writeFileSync(manPath, man);

// 3. assinatura fixa: atualizar o app no celular sem precisar desinstalar
const gradlePath = path.join(app, 'build.gradle');
let g = fs.readFileSync(gradlePath, 'utf8');
if (!g.includes('signingConfigs.fixa')) {
  g += `
android {
    signingConfigs {
        fixa {
            storeFile file("../../keystore/debug.keystore")
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }
    buildTypes {
        debug { signingConfig signingConfigs.fixa }
    }
}
`;
  fs.writeFileSync(gradlePath, g);
}
console.log('Projeto Android ajustado.');
