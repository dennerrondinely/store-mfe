const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config();

// 🔹 Variáveis de ambiente
const {
  BUCKET_URL,
  FIREBASE_SERVICE_ACCOUNT_JSON,
  STORE_MODULE_ID,
  COLLECTION_NAME
} = process.env;

// 🔹 Ler package.json para pegar a versão
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const version = packageData.version;

// 🔹 Inicializar Firebase Admin
const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);

// Corrigir quebras de linha no private_key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createModule() {
  try {
    // Criar um novo documento com ID automático
    const docRef = await db.collection(COLLECTION_NAME).add({
      scriptId: "Store",
      moduleId: STORE_MODULE_ID,
      version: version,
      url: BUCKET_URL,
      active: false
    });

    console.log(`✅ Novo módulo criado com ID: ${docRef.id}`);
  } catch (error) {
    console.error('❌ Erro ao criar módulo no Firebase:', error);
    process.exit(1);
  }
}

createModule();
