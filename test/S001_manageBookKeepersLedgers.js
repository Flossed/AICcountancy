/* File             : S0001_manageBookKeepersLedgers.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2024
   Description      : Testfile to test manageBookKeepersLedgers functionality
   Notes            :
*/

/*
async function manageBookKeepersLedgers ( dataRecord,recordID )
{   try
    {   logger.trace( applicationName + ':manageBookKeepersLedgers:():Started' );
        const dataModel                =  'bookKeepersLedgers';

        switch ( dataRecord.action )
        {  case 'getData'               :  {   const allRecords  =  await manageData.getRecords( dataModel );
                                               return allRecords;
                                           }
           case 'getRecordData'         :  {   const recordData = await manageData.getRecord( dataModel,recordID );
                                               logger.trace( applicationName + ':manageBookKeepersLedgers:():Done' );
                                               return recordData;
                                           }

           case 'updateData'            :  {   const updateResp =  await manageData.updateRecord( dataModel,dataRecord );
                                               return updateResp;
                                           }
           case 'createData'            :  {   const resp = await manageData.createRecord( dataModel,dataRecord );
                                               return resp;
                                           }
           case 'deleteData'            :  {   const deleteResp = await manageData.deleteRecord( dataModel,dataRecord );
                                               return deleteResp;
                                           }
           default                      :  logger.error( applicationName + ':manageBookKeepersLedgers:Unknown action : [' + dataRecord.action + '];' ) ;
                                           break;
        }
        logger.trace( applicationName + ':manageBookKeepersLedgers:():Done' );
        return ;
    }
    catch ( ex )
    {   logger.exception( applicationName + ':manageBookKeepersLedgers:():An exception occurred :[' + ex + '].' );
    }

}
*/

const mongoose                         = require( 'mongoose' );
const assert                           = require( 'assert' );
const chai                             = require( 'chai' );
const should                           = chai.should();
const expect                           = chai.expect;

const config                           = require( '../services/configuration' );
const errorCatalog                     = require( '../services/errorCatalog' );
const manageBookKeepersLedgers         = require( '../services/manageBookKeepersLedgers' );

const db                               = mongoose.connection;

mongoose.connect( config.get( 'application:DBTest' ), {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true} );
let result;
let dataArray = [];
const idRecord = [];
db.on( 'error', console.error.bind( console, 'connection error: ' ) );
db.once( 'open', function () { console.log( 'Connected successfully to DB: [' + config.get( 'application:DBTest' ) + '].'  ); } );



describe( 'Testsuite testing Services : manageBookKeepersLedgers : getData', async () =>
{   before( async () =>
    {   try
        {
            const dataRecord = {'action':'getData'};
            const recordID   = '';
            result     = await manageBookKeepersLedgers.manageBookKeepersLedgers( dataRecord,recordID );
            dataArray = result.body;
            return;
        }
        catch ( ex )
        {   assert.ok( 'An exception was thrown as expected' );
        }
    } );

    describe( 'Positive Test: verify \'getdata\'',  () =>
    {    it( 'Response should be a valid object: ', ( done ) =>
         {  expect( result ).to.be.an( 'object' );
            result.should.have.property( 'returnCode' );
            expect( result['returnCode'] ).to.equal( errorCatalog.NO_ERROR );
            result.should.have.property( 'returnMsg' );
            result.should.have.property( 'body' );
            expect( result.body ).to.be.an( 'array' );
            expect( result.body.length ).to.be.at.least( 1 );
            done();
         } ); 
    } );

    after( async () =>
    {   describe( 'Positive Test: verify each \'getRecordData\' element',  () =>
        {   dataArray.forEach( ( dataRecord, index ) =>
            {   it( 'Response ' + index + ' should be a valid Element: ', ( done ) =>
                {  expect( dataRecord ).to.be.an( 'object' );
                   dataRecord.should.have.property( 'bkLedgerActie' );
                   dataRecord.should.have.property( 'bkLedgerID' );
                   dataRecord.should.have.property( 'bkLedgerName' );
                   dataRecord.should.have.property( 'bkLedgerdstAccount' );
                   dataRecord.should.have.property( 'bkLedgerDescription' );
                   dataRecord.should.have.property( 'bkLedgerLabel' );
                   done();
                } ); 
            } );
        } );
    } );

} );



describe( 'Testsuite testing Services : manageBookKeepersLedgers: getRecordData', async () =>
    {   before( async () =>
        {   try
            {
                const dataRecord = {'action':'getData'};
                const recordID   = '';
                result     = await manageBookKeepersLedgers.manageBookKeepersLedgers( dataRecord,recordID );
                dataArray = result.body;
                dataArray.forEach( ( dataRecord, index ) => { idRecord.push( dataRecord._id ); } );
                return;
            }
            catch ( ex )
            {   assert.ok( 'An exception was thrown as expected' );
            }
        } );

        describe( 'Positive Test: verify \'getdata\' result',  () =>
        {    it( 'Response should be a valid object: ', ( done ) =>
             {  expect( result ).to.be.an( 'object' );
                result.should.have.property( 'returnCode' );
                expect( result['returnCode'] ).to.equal( errorCatalog.NO_ERROR );
                result.should.have.property( 'returnMsg' );
                result.should.have.property( 'body' );
                expect( result.body ).to.be.an( 'array' );
                expect( result.body.length ).to.be.at.least( 1 );
                done();
             } );
        } );

        after( async () =>
        {   describe( 'Positive Test: verify each \'getRecordData\' element by ID',  () =>
            {   dataArray.forEach( ( dataRecord, index ) =>
                {   let recordResult;
                    it( 'Response '+ index + ' should be a correct response OBj by ID', async () =>
                    {   const dataRecord = {'action':'getRecordData'};
                        const recordID   = idRecord[index];
                        recordResult     = await manageBookKeepersLedgers.manageBookKeepersLedgers( dataRecord,recordID );
                        expect( recordResult ).to.be.an( 'object' );
                        recordResult.should.have.property( 'returnCode' );
                        expect( recordResult['returnCode'] ).to.equal( errorCatalog.NO_ERROR );
                        recordResult.should.have.property( 'returnMsg' );
                        recordResult.should.have.property( 'body' );
                        expect( recordResult.body ).to.be.an( 'object' );
                    } );
            } );
        } );
    } );
} );


/* 
{
  _id: 663b3836dd52653e8c5fe683,
  __v: 0,
  bkLedgerActie: 'create',
  bkLedgerID: '612000',
  bkLedgerName: 'Bureaubenodigdheden',
  bkLedgerdstAccount: 'Verification',
  bkLedgerDescription: '1008_Kantoor\r\n',
  bkLedgerEditState: 'off',
  bkLedgerLabel: '612000_Bureaubenodigdheden'
}
*/

describe( 'Testsuite testing Services : manageBookKeepersLedgers: createData', async () =>
{   before( async () =>
    {   try
        {   const dataRecord = {'action':'getData'};
            const recordID   = '';
            const bookKeeperLedger = {};
            bookKeeperLedger.bkLedgerActie        = 'create';
            bookKeeperLedger.bkLedgerID           = '612000';
            bookKeeperLedger.bkLedgerName         = 'Bureaubenodigdheden';
            bookKeeperLedger.bkLedgerdstAccount   = 'Verification';
            bookKeeperLedger.bkLedgerDescription  = '1008_Kantoor\r\n';
            bookKeeperLedger.bkLedgerEditState    = 'off';
            bookKeeperLedger.bkLedgerLabel        = '612000_Bureaubenodigdheden';


            
            result     = await manageBookKeepersLedgers.manageBookKeepersLedgers( dataRecord,recordID );
            dataArray = result.body;
            dataArray.forEach( ( dataRecord, index ) => { idRecord.push( dataRecord._id ); } );
            return;
        }
        catch ( ex )
        {   assert.ok( 'An exception was thrown as expected' );
        }
    } );
    describe( 'Positive Test: verify \'getdata\' result',  () =>
    {    it( 'Response should be a valid object: ', ( done ) =>
         {  expect( result ).to.be.an( 'object' );
            result.should.have.property( 'returnCode' );
            expect( result['returnCode'] ).to.equal( errorCatalog.NO_ERROR );
            result.should.have.property( 'returnMsg' );
            result.should.have.property( 'body' );
            expect( result.body ).to.be.an( 'array' );
            expect( result.body.length ).to.be.at.least( 1 );
            done();
         } );
    } );
    after( async () =>
    {   describe( 'Positive Test: verify each \'getRecordData\' element by ID',  () =>
        {   dataArray.forEach( ( dataRecord, index ) =>
            {   console.log(dataRecord);
                let recordResult;
                it( 'Response '+ index + ' should be a correct response OBj by ID', async () =>
                {   const dataRecord = {'action':'getRecordData'};
                    const recordID   = idRecord[index];
                    recordResult     = await manageBookKeepersLedgers.manageBookKeepersLedgers( dataRecord,recordID );
                    expect( recordResult ).to.be.an( 'object' );
                    recordResult.should.have.property( 'returnCode' );
                    expect( recordResult['returnCode'] ).to.equal( errorCatalog.NO_ERROR );
                    recordResult.should.have.property( 'returnMsg' );
                    recordResult.should.have.property( 'body' );
                    expect( recordResult.body ).to.be.an( 'object' );
                } );
            } );
        } );
    } );
} );
