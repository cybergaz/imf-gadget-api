import { db } from "../config/database";
import { Result, statusEnum } from "../config/types";
import { users } from "../models/models";
import { eq } from "drizzle-orm";


// const userExists = async (id: number) => {
//     try {
//         const user = await db.select({ email: users.email }).from(users).where(eq(users.id, id));
//         return { success: true, message: "[DATABASE] User Found ✔️", data: user };
//     }
//     catch (error) {
//         console.error("[DATABASE] Error Finding User:", error);
//         return { success: false, message: "[DATABASE] User Not Found ✖️, Please login." };
//     }
// }

const getEmail = async (id: number): Promise<Result> => {
    try {
        const user = await db.select({ email: users.email }).from(users).where(eq(users.id, id));
        return { success: true, message: "[DATABASE] User Found ✔️", data: user[0].email };
    }
    catch (error) {
        console.error("[DATABASE] Error Finding Email:", error);
        return { success: false, message: "[DATABASE] User Not Found ✖️" };
    }
}

const generateStatus = () => {
    const statuses = statusEnum
    return statuses[Math.floor(Math.random() * statuses.length)];
}

const generateCodename = () => {
    const codenames = [
        'The Nightingale', 'The Kraken', 'The Phantom',
        'The Falcon', 'The Shadow', 'The Viper',
        'The Orion', 'The Titan', 'The Eclipse',
        'The Leviathan', 'The Basilisk', 'The Gryphon',
        'The Behemoth', 'The Sphinx', 'The Chimera',
        'The Wendigo', 'The Hydra', 'The Colossus',
        'The Banshee', 'The Andromeda', 'The Supernova',
        'The Nebula', 'The Solstice', 'The Aurora',
        'The Vortex', 'The Tempest', 'The Monolith',
        'The Obsidian', 'The Glacier', 'The Harbinger',
        'The Enigma', 'The Paradox', 'The Vanguard',
        'The Onslaught', 'The Ironclad', 'The Aegis',
        'The Omen', 'The Requiem', 'The Eternity',
        'The Crimson Cyclone', 'The Silent Specter',
        'The Silver Serpent', 'The Blackened Blade',
        'The Wandering Wraith'
    ];
    return codenames[Math.floor(Math.random() * codenames.length)];
};

const generateSuccessProbability = () => Math.floor(Math.random() * 100) + 1;

const generateConfirmationCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

export { getEmail, generateStatus, generateCodename, generateSuccessProbability, generateConfirmationCode };
