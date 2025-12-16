import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { addProductToOrder } from "#db/queries/orders_products";
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
  const products = await Promise.all([
    createProduct({
      title: "Parmigiano Reggiano",
      description: "aged, nutty Italian cheese",
      price: 24.99,
    }),
    createProduct({
      title: "Truffle Oil",
      description: "truffle-infused oil",
      price: 27.5,
    }),
    createProduct({
      title: "Wagyu Beef",
      description: "highly marbled, A5",
      price: 65.7,
    }),
    createProduct({
      title: "Sourdough",
      description: "naturally fermented, tangy bread",
      price: 15.99,
    }),
    createProduct({
      title: "Short Ribs",
      description: "richly marbled",
      price: 32.56,
    }),
    createProduct({
      title: "Chanterelle Mushrooms",
      description: "delicate, earthy mushrooms",
      price: 18.75,
    }),
    createProduct({
      title: "Saffron Rice",
      description: "fragrant saffron-infused rice",
      price: 14.25,
    }),
    createProduct({
      title: "Balsamic Vinegar",
      description: "dry aged, complex flavor",
      price: 11.99,
    }),
    createProduct({
      title: "Heirloom Tomatoes",
      description: "vine-ripened red tomatoes",
      price: 9.5,
    }),
    createProduct({
      title: "Beef Stock",
      description: "slow-simmered stock",
      price: 8.25,
    }),
  ]);

  const order1 = await createOrder({
    user_id: alyssa.id,
    date: "2025-12-15",
    note: "Alyssa's first order",
  });
  await Promise.all([
    addProductToOrder({
      order_id: order1.id,
      product_id: products[0].id,
      quantity: 1,
    }),
    addProductToOrder({
      order_id: order1.id,
      product_id: products[2].id,
      quantity: 1,
    }),
    addProductToOrder({
      order_id: order1.id,
      product_id: products[3].id,
      quantity: 2,
    }),
    addProductToOrder({
      order_id: order1.id,
      product_id: products[5].id,
      quantity: 1,
    }),
    addProductToOrder({
      order_id: order1.id,
      product_id: products[8].id,
      quantity: 1,
    }),
  ]);
}
