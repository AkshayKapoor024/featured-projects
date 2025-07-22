const { MongoClient } = require("mongodb");

// 🔌 Local and Atlas URIs
const localUri = "mongodb://localhost:27017";
const atlasUri = "mongodb+srv://workakshaykapoor24:wyHGEdiiwIriQVub@cluster0.fm4pjkm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

(async () => {
  const localClient = new MongoClient(localUri);
  const atlasClient = new MongoClient(atlasUri);

  try {
    await localClient.connect();
    await atlasClient.connect();

    const sourceDb = localClient.db("Schedulo");
    const targetDb = atlasClient.db("Schedulo");
    const collections = await sourceDb.listCollections().toArray();

    for (const { name } of collections) {
      const docs = await sourceDb.collection(name).find().toArray();
      if (docs.length > 0) {
        await targetDb.collection(name).insertMany(docs);
        console.log(`✅ Copied ${docs.length} docs from ${name}`);
      }
    }
  } catch (e) {
    console.error("❌ Migration error:", e);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
})();