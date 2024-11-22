const { MongoClient, Collection } = require("mongodb");
const { z } = require("zod");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcrypt");
const prompt = require("prompt-sync");
const pprompt = require("password-prompt");

dotenv.config({ path: path.join(__dirname, "../.env") });

const schema = z.object({
	DB_URL: z.string(),
	SALT_ROUNDS: z.string(),
});

const argSchema = z.enum(["add", "remove"]);

const arg = argSchema.parse(process.argv[2]);

const env = schema.parse(process.env);

const DB_URL = env.DB_URL;
const DB_NAME = env.DB_NAME;
const ADMINS_COLLECTION_NAME = "admins";

const client = new MongoClient(DB_URL);

class Cli {
	static add(collection) {
		return new Promise(async (resolve, reject) => {
			const username = prompt()("Enter username: ");
			const password = await pprompt("Enter password: ", { method: "hide" });
			const hashedPassword = bcrypt.hash(
				password,
				+env.SALT_ROUNDS,
				async (err, hash) => {
					const exists = (await collection.findOne({ username })) !== null;
					if (exists) {
						reject(new Error("User already exists"));
					}
					collection
						.insertOne({ username, password: hash })
						.then(resolve)
						.catch(reject);
				}
			);
		});
	}
	static remove(collection) {
		return new Promise((resolve, reject) => {
			const username = prompt()("Enter username: ");
			collection.deleteMany({ username }).then(resolve).catch(reject);
		});
	}
}

client.connect().then(async () => {
	const db = client.db(DB_NAME);
	const collection = db.collection(ADMINS_COLLECTION_NAME);
	try {
		switch (arg) {
			case "add":
				await Cli.add(collection);
				break;
			case "remove":
				await Cli.remove(collection);
				break;
			default:
				console.log("Invalid argument");
		}
	} catch (e) {
		console.log(e);
	} finally {
		client.close();
	}
});
