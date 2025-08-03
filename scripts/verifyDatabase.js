const mongoose = require('mongoose');

async function verifyDatabase() {
    try {
        // Connect to the new database
        const targetUri = 'mongodb://192.168.129.10/AICcountancy';
        const connection = await mongoose.createConnection(targetUri);
        console.log('Connected to AICcountancy database\n');

        // Get all collections
        const collections = await connection.db.listCollections().toArray();
        console.log(`Total collections: ${collections.length}\n`);

        // Show document counts for each collection
        console.log('Collection Document Counts:');
        console.log('-'.repeat(40));
        
        let totalDocuments = 0;
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const collection = connection.db.collection(collectionName);
            const count = await collection.countDocuments();
            totalDocuments += count;
            console.log(`${collectionName.padEnd(30)} ${count} documents`);
        }
        
        console.log('-'.repeat(40));
        console.log(`Total documents across all collections: ${totalDocuments}`);

        // Close connection
        await connection.close();
        console.log('\nVerification complete!');

    } catch (error) {
        console.error('Error verifying database:', error);
        process.exit(1);
    }
}

// Run verification
verifyDatabase();