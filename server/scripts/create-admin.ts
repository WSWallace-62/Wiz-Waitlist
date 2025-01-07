import { db } from "@db";
import { users } from "@db/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  const hashedPassword = await hashPassword("password123");

  // Delete existing admin user if exists
  await db.delete(users).where(eq(users.username, "admin"));

  // Create new admin user
  const [newUser] = await db
    .insert(users)
    .values({
      username: "admin",
      password: hashedPassword,
    })
    .returning();

  console.log("Admin user created successfully:", newUser);
}

createAdminUser().catch(console.error);