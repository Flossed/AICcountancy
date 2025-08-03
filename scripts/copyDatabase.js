const mongoose = require('mongoose');

async function copyDatabase() {
    try {
        // Connect to the source database
        const sourceUri = 'mongodb://192.168.129.10/zanddBooks';
        const sourceConnection = await mongoose.createConnection(sourceUri);
        console.log('Connected to source database: zanddBooks');

        // Connect to the target database
        const targetUri = 'mongodb://192.168.129.10/AICcountancy';
        const targetConnection = await mongoose.createConnection(targetUri);
        console.log('Connected to target database: AICcountancy');

        // Get all collections from source database
        const collections = await sourceConnection.db.listCollections().toArray();
        console.log(`Found ${collections.length} collections to copy`);

        // Copy each collection
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            console.log(`Copying collection: ${collectionName}`);

            // Get all documents from source collection
            const sourceCollection = sourceConnection.db.collection(collectionName);
            const documents = await sourceCollection.find({}).toArray();

            if (documents.length > 0) {
                // Insert documents into target collection
                const targetCollection = targetConnection.db.collection(collectionName);
                await targetCollection.insertMany(documents);
                console.log(`  Copied ${documents.length} documents`);
            } else {
                console.log(`  No documents to copy`);
            }
        }

        // Close connections
        await sourceConnection.close();
        await targetConnection.close();
        console.log('\nDatabase copy completed successfully!');
        console.log('New database: AICcountancy');

    } catch (error) {
        console.error('Error copying database:', error);
        process.exit(1);
    }
}

// Run the copy
copyDatabase();