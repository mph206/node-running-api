import { usersCollection } from "./Database.ts";
import { User } from "../domain/User.d.ts"

export const createUser = async (user: User) => {
    const foundUser = await usersCollection.findOne({ id: user.id });
    if (foundUser) {
        throw new Error("User already exists");
    };

    await usersCollection.insertOne(user);
}
