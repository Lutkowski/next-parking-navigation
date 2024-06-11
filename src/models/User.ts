import mongoose, {model, Schema} from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: [true, "Укажите никнейм"],
    },
    email: {
        type: String,
        required: [true, "Укажите email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Укажите пароль"],
    }
})

const User = mongoose.models?.User || model<IUser>('User', UserSchema)
export default User