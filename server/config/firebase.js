import firebaseAdmin from "firebase-admin";
import env from "dotenv";
env.config();

const serviceAccount = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain,
};

/** If you don't have the env variables of the API you will get `false`, If you have it you will get the `firebaseAdmin` 
*/
let firebaseAdmin_or_false
if (serviceAccount.type) {
  firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) })
  firebaseAdmin_or_false = firebaseAdmin
} else {
  firebaseAdmin_or_false = false
}

export default firebaseAdmin_or_false;

