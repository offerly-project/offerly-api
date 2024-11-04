import { Document, ObjectId } from "mongodb";

export interface IUser extends Document {
	_id?: ObjectId;
	cards: ObjectId[];
	favorites: ObjectId[];
	email: string;
	password: string;
	full_name: string;
}
