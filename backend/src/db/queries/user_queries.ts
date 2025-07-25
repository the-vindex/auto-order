import {db} from "../index";
import {users} from "../schema";
import { eq, lt, gte, ne } from 'drizzle-orm';

export async function getAllUsers(){
    let allUsers = await db.select().from(users);
    return allUsers;
}

export async function getUserById(id: string){
    const user = await db.select().from(users).where(eq(users.userId, id));
    if (!user || user.length === 0) {
        throw new Error(`User with ID ${id} not found`);
    }
    return user[0];
}

export async function createUser(name: string) {
    const [newUser] = await db.insert(users).values({name}).returning();
    return newUser;
}
