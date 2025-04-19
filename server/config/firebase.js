import firebaseAdmin from "firebase-admin";
import env from "dotenv";
env.config();

const private_key = process.env.private_key?.replace(/\\n/g, "\n");

const serviceAccount = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
};

const noNullsInServiceAccount = Object.values(serviceAccount).every(Boolean)
/** If you don't have the env variables of the API you will get `false`, If you have it you will get the `firebaseAdmin` 
*/
let firebaseAdmin_or_false
if (noNullsInServiceAccount) {
    try {
        firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) })
        firebaseAdmin_or_false = firebaseAdmin
        console.log(`🔔 irebaseAdmin initialized correctly 💛 `)

    } catch (error) {
        console.error(`error while initializing firebaseAdmin 😭 ${error}`)
        firebaseAdmin_or_false = false
    }
} else {
    console.warn("⚠️ Missing Firebase environment variables.");

    firebaseAdmin_or_false = false
}
console.log(`firebaseAdmin_or_false: ${firebaseAdmin_or_false}`);
export default firebaseAdmin_or_false;

