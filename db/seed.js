import db from "#db/client";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  const [alyssa, danae] = await Promise.all([
    createUser({ username: "alyssa", password: "barnacle" }),
    createUser({ username: "danae", password: "giraffe" }),
  ]);
}
