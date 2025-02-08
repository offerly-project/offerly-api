import admin from "firebase-admin";
import serviceAccount from "../../firebase-svc-acc.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const messaging = admin.messaging();
