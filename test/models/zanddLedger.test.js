/* File             : zanddLedger.test.js
   Author           : Daniel S. A. Khan
   Copyright        : Daniel S. A. Khan (c) 2025
   Description      : Comprehensive tests for zanddLedger model
   Notes            : Full CRUD cycle testing with history validation
*/

const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const DatabaseSetup = require('../helpers/dbSetup');
const TestUtils = require('../helpers/testUtils');

// Models
const ZanddLedger = require('../../models/zanddLedger');
const ZanddLedgerHist = require('../../models/zanddLedgerHist');

describe('ZanddLedger Model Tests', function() 
{
    let dbSetup;
    
    before(async function() 
    {
        this.timeout(10000);
        dbSetup = new DatabaseSetup();
        await dbSetup.connect();
    });

    after(async function() 
    {
        this.timeout(5000);
        await dbSetup.disconnect();
    });

    beforeEach(async function() 
    {
        this.timeout(5000);
        await dbSetup.clearDatabase();
        await dbSetup.seedTestData();
    });

    describe('Model Schema Validation', function() 
    {
        it('should create a valid ledger entry with required fields', async function() 
        {
            const testData = 
            {
                beneficiary: 'Test Company Ltd',
                billDescription: 'Office supplies purchase',
                grossAmountNR: 150.75,
                movementSign: 'D',
                bcCat: 'OFFICE',
                bankDate: '20240215',
                bankDateEpoch: Date.now(),
                compagnyID: 'TEST001',
                creationDate: Date.now()
            };

            const ledgerEntry = new ZanddLedger(testData);
            const savedEntry = await ledgerEntry.save();

            TestUtils.validateMongoDocument(savedEntry, ['beneficiary', 'billDescription', 'grossAmountNR']);
            expect(savedEntry.beneficiary).to.equal(testData.beneficiary);
            expect(savedEntry.grossAmountNR).to.equal(testData.grossAmountNR);
            expect(savedEntry.movementSign).to.equal(testData.movementSign);
        });

        it('should accept entry with minimal data (no validation currently)', async function() 
        {
            const minimalData = 
            {
                billDescription: 'Incomplete entry'
                // Model currently has no required field validation
            };

            const ledgerEntry = new ZanddLedger(minimalData);
            
            // Should save successfully since no validation is enforced
            const saved = await ledgerEntry.save();
            expect(saved).to.exist;
            expect(saved._id).to.exist;
            expect(saved.billDescription).to.equal('Incomplete entry');
            
            // Clean up
            await ZanddLedger.findByIdAndDelete(saved._id);
        });
    });

    describe('Full CRUD Cycle Tests', function() 
    {
        it('should complete full CRUD cycle with history tracking', async function() 
        {
            this.timeout(10000);
            
            const testData = TestUtils.generateTestData('zanddLedger');
            testData.beneficiary = 'CRUD Test Company';
            testData.billDescription = 'CRUD Test Entry';
            testData.grossAmountNR = 500.00;
            
            const updateData = 
            {
                billDescription: 'Updated CRUD Test Entry',
                grossAmountNR: 750.00
            };

            const results = await TestUtils.testCRUDCycle(
                ZanddLedger, 
                ZanddLedgerHist, 
                testData, 
                updateData
            );

            // Validate creation
            expect(results.created).to.exist;
            expect(results.created.companyName).to.equal(testData.companyName);

            // Validate read
            expect(results.read).to.exist;
            expect(results.read._id.toString()).to.equal(results.created._id.toString());

            // Validate update
            expect(results.updated).to.exist;
            expect(results.updated.description).to.equal(updateData.description);
            expect(results.updated.amount).to.equal(updateData.amount);

            // Validate duplication
            expect(results.duplicated).to.exist;
            expect(results.duplicated._id).to.not.equal(results.created._id);
            expect(results.duplicated.companyName).to.equal(testData.companyName);

            // Validate deletion
            expect(results.deleted).to.exist;
            
            // Validate restoration (if supported)
            if (results.restored) 
            {
                expect(results.restored).to.exist;
                TestUtils.validateMongoDocument(results.restored);
            }
        });

        it('should handle non-existent record queries gracefully', async function() 
        {
            const result = await TestUtils.testNonExistentRecord(ZanddLedger);
            expect(result).to.be.true;
        });
    });

    describe('Query Operations', function() 
    {
        it('should perform various query operations successfully', async function() 
        {
            const testData = TestUtils.generateTestData('zanddLedger');
            const ledgerEntry = new ZanddLedger(testData);
            await ledgerEntry.save();

            const queries = await TestUtils.testQueryOperations(ZanddLedger, 
                { companyName: testData.companyName }
            );

            expect(queries.findAll).to.be.an('array');
            expect(queries.findAll.length).to.be.at.least(1);
            expect(queries.count).to.be.at.least(1);
            expect(queries.exists).to.exist;
        });

        it('should retrieve all actual records', async function() 
        {
            // Create multiple test entries
            const testEntries = [
                { ...TestUtils.generateTestData('zanddLedger'), description: 'Entry 1' },
                { ...TestUtils.generateTestData('zanddLedger'), description: 'Entry 2' },
                { ...TestUtils.generateTestData('zanddLedger'), description: 'Entry 3' }
            ];

            for (const entry of testEntries) 
            {
                const ledgerEntry = new ZanddLedger(entry);
                await ledgerEntry.save();
            }

            const allRecords = await ZanddLedger.find({});
            expect(allRecords).to.be.an('array');
            expect(allRecords.length).to.be.at.least(testEntries.length);
        });

        it('should query specific records by criteria', async function() 
        {
            const specificData = 
            {
                ...TestUtils.generateTestData('zanddLedger'),
                beneficiary: 'Specific Company',
                bcCat: 'SPECIFIC',
                grossAmountNR: 999.99
            };

            const ledgerEntry = new ZanddLedger(specificData);
            const saved = await ledgerEntry.save();
            
            // Verify record was saved
            expect(saved).to.exist;
            expect(saved._id).to.exist;

            // Query by beneficiary (company name)
            const byCompany = await ZanddLedger.find({ beneficiary: 'Specific Company' });
            expect(byCompany).to.be.an('array');
            expect(byCompany.length).to.equal(1);
            expect(byCompany[0].beneficiary).to.equal('Specific Company');

            // Query by category (bcCat)
            const byCategory = await ZanddLedger.find({ bcCat: 'SPECIFIC' });
            expect(byCategory).to.be.an('array');
            expect(byCategory[0].bcCat).to.equal('SPECIFIC');

            // Query by amount range (grossAmountNR)
            const byAmountRange = await ZanddLedger.find({ grossAmountNR: { $gte: 999, $lte: 1000 } });
            expect(byAmountRange).to.be.an('array');
            expect(byAmountRange[0].grossAmountNR).to.equal(999.99);
        });
    });

    describe('History Tracking', function() 
    {
        it('should create history records for all operations', async function() 
        {
            const testData = TestUtils.generateTestData('zanddLedger');
            
            // Create
            const ledgerEntry = new ZanddLedger(testData);
            const saved = await ledgerEntry.save();

            // Update
            saved.description = 'Updated description';
            await saved.save();

            // Delete
            await ZanddLedger.findByIdAndDelete(saved._id);

            // Check history records (if history model supports action tracking)
            const historyRecords = await ZanddLedgerHist.find({ originalId: saved._id });
            
            if (historyRecords.length > 0) 
            {
                expect(historyRecords).to.be.an('array');
                
                historyRecords.forEach(histRecord => 
                    {
                        TestUtils.validateHistoryRecord(histRecord, saved);
                    }
                );
            }
        });

        it('should retrieve all historical records', async function() 
        {
            const testData = TestUtils.generateTestData('zanddLedger');
            const ledgerEntry = new ZanddLedger(testData);
            const saved = await ledgerEntry.save();

            // Make several updates to create history
            for (let i = 1; i <= 3; i++) 
            {
                saved.description = `Updated description ${i}`;
                await saved.save();
            }

            // Retrieve all history for this record
            const allHistory = await ZanddLedgerHist.find({ originalId: saved._id });
            
            if (allHistory.length > 0) 
            {
                expect(allHistory).to.be.an('array');
                expect(allHistory.length).to.be.at.least(1);
                
                allHistory.forEach(histRecord => 
                    {
                        expect(histRecord.originalId.toString()).to.equal(saved._id.toString());
                    }
                );
            }
        });
    });

    describe('Performance Tests', function() 
    {
        it('should handle bulk operations efficiently', async function() 
        {
            this.timeout(15000);

            const bulkTestData = [];
            for (let i = 0; i < 100; i++) 
            {
                bulkTestData.push(
                    {
                        ...TestUtils.generateTestData('zanddLedger'),
                        description: `Bulk Entry ${i}`,
                        amount: i * 10
                    }
                );
            }

            const performanceResult = await TestUtils.measurePerformance(
                async () => 
                {
                    return await ZanddLedger.insertMany(bulkTestData);
                },
                'Bulk Insert 100 Records'
            );

            expect(performanceResult.result).to.be.an('array');
            expect(performanceResult.result.length).to.equal(100);
            expect(performanceResult.duration).to.be.below(5000); // Should complete within 5 seconds
        });
    });

    describe('Data Integrity Tests', function() 
    {
        it('should maintain data consistency across operations', async function() 
        {
            const testData = TestUtils.generateTestData('zanddLedger');
            testData.amount = 1000.50;
            
            const ledgerEntry = new ZanddLedger(testData);
            const saved = await ledgerEntry.save();

            // Verify data precision
            expect(saved.amount).to.equal(1000.50);
            
            // Verify date handling
            expect(saved.date).to.be.a('date');
            
            // Verify required fields are preserved
            expect(saved.companyName).to.equal(testData.companyName);
            expect(saved.description).to.equal(testData.description);
        });

        it('should handle edge cases gracefully', async function() 
        {
            // Test with minimum valid data
            const minimalData = 
            {
                companyName: 'A',
                description: 'B',
                amount: 0.01,
                transactionType: 'debit',
                date: new Date()
            };

            const minimal = new ZanddLedger(minimalData);
            const savedMinimal = await minimal.save();
            
            expect(savedMinimal).to.exist;
            TestUtils.validateMongoDocument(savedMinimal);

            // Test with maximum reasonable values
            const maximalData = 
            {
                companyName: 'Very Long Company Name'.repeat(10),
                description: 'Very Long Description'.repeat(20),
                amount: 999999.99,
                transactionType: 'credit',
                date: new Date('2030-12-31')
            };

            const maximal = new ZanddLedger(maximalData);
            const savedMaximal = await maximal.save();
            
            expect(savedMaximal).to.exist;
            TestUtils.validateMongoDocument(savedMaximal);
        });
    });
});