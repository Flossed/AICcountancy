# ADR-0001: Migrate to Separate Database

## Status
Accepted

## Context
The AICcountancy project is a fork of the zanddBooks application that will introduce AI-powered features and modernizations. To safely develop and test these new features without affecting the production zanddBooks database, we need a separate database instance.

## Decision
We will create a new MongoDB database called `AICcountancy` on the same server (192.168.129.10) and migrate all existing data from `zanddBooks` to this new database. The application configuration will be updated to point to the new database.

## Consequences

### Positive
- Complete isolation from production data during development
- Freedom to modify schema and add AI-related collections
- Ability to test data migrations and transformations safely
- Maintains full data integrity of original system

### Negative
- Requires manual synchronization if production data changes are needed
- Additional storage space required on the MongoDB server
- Need to maintain awareness of which database is being used

### Technical Details
- Database: MongoDB at `mongodb://192.168.129.10/AICcountancy`
- Migration method: Full collection copy preserving all documents
- Collections migrated: 19 collections, 116,989 documents total
- Configuration: Updated in `/config/default.json`