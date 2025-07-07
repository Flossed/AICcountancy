/* File             : zndMngCodaFiles.js
   Author           : Daniel S. A. Khan
   Copywrite        : Daniel S. A. Khan (c) 2021
   Notes            :
   Description      :
*/

/* ------------------     External Application Libraries      ----------------*/
const {logger,applicationName}         = require( '../services/generic' );
const fileUpload                        = require('express-fileupload')
const path                              = require('path');
const md5                               = require('sha256');
const fs                                = require('fs');
const util                              = require('util');
const { v4: uuidv4 }                    = require('uuid');


const zndMsg                              = require('../services/zndMsg');

const errorCatalog                      = require('../services/errorCatalog')



const codaRecordModel                   = require('../models/codaRecord')



const BAD_REQUEST                       = errorCatalog.BAD_REQUEST;
const BAD_RESULT                        = errorCatalog.BAD_RESULT;
const EXCEPTION                         = errorCatalog.EXCEPTION;
const NO_ERROR                          = errorCatalog.NO_ERROR;

let   StatementID, TransactionID, ID;     

async function storeInDB(statementID, transactionID, recordID, articleCode,ID,codaRecordJSON)
{   try
    {   var badResult, noError, badRequest, createResult, recordHash,CR,results;

        logger.trace(applicationName + ':zndMngCodaFiles:storeInDB:Started.');

        badResult                         = { ...errorCatalog.badResult  };
        badRequest                        = { ...errorCatalog.badRequest };
        exception                         = { ...errorCatalog.exception  };
        noError                           = { ...errorCatalog.noError    };

        recordHash                      = md5(codaRecordJSON)
        CR                              = {};
        CR.recordHash                   = recordHash;
        CR.statementID                  = statementID;
        CR.transactionID                = transactionID;
        CR.recordID                     = recordID;
        CR.articleCode                  = articleCode;
        CR.ID                           = ID 
        CR.codaRecordJSON               = codaRecordJSON;

        results                         = await codaRecordModel.find({recordHash:recordHash});

        if (  results == null || results == '')
        {   createResult                = await codaRecordModel.create(CR);
            zndMsg.eventBus.sendEvent('newCodaRecord', CR);
            logger.trace(applicationName + ':zndMngCodaFiles:storeInDB:Done.');
            noError.body                = createResult
            return noError;
        }

        logger.debug(applicationName + ':zndMngCodaFiles:storeInDB:Skipping  codaRecordo  Entry already exist in DB.');
        console.log( codaRecordJSON );
        console.log(' adsjkhdaskjldsajkhdsakljdsadsahjkdjsklsdakjdskjlasjkldjaslkdjaslkjdlkasjdlkjasdlkajsdlkjasd');
        logger.error(applicationName + ':zndMngCodaFiles:storeInDB:An error occurred whilst adding record.');
        badResult.body                = 'codaRecord  Entry already exist in DB';
        return badResult;
   }
   catch(ex)
   {   logger.exception(applicationName + ':zndMngCodaFiles:storeInDB:An Exception occurred [' + ex + '].');
       exception.body                   = ex;
       return exception;
   }

}



async function getCodaHeaderRecord0(record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaHeaderRecord0:Started.');

        badResult                         = { ...errorCatalog.badResult  };
        badRequest                        = { ...errorCatalog.badRequest };
        exception                         = { ...errorCatalog.exception  };
        noError                           = { ...errorCatalog.noError    };

        codaRecord                        = {};
        codaRecord.statementID            = String(record.slice(5,11));
        codaRecord.transactionID          = "";
        codaRecord.articleCode            = "";
        codaRecord.recordID               = String(record.slice(0,1));
        codaRecord.padding1               = String(record.slice(1,5));
        codaRecord.creationDate           = String(record.slice(5,11));
        codaRecord.BankID                 = String(record.slice(11,14));
        codaRecord.applicationCode        = String(record.slice(14,16));
        codaRecord.duplicateID            = String(record.slice(16,17));
        codaRecord.padding2               = String(record.slice(17,24));
        codaRecord.fileReference          = String(record.slice(24,34));
        codaRecord.nameAddressee          = String(record.slice(34,60));
        codaRecord.BICCode                = String(record.slice(60,71));
        codaRecord.accountHolderID        = String(record.slice(71,82));
        codaRecord.padding3               = String(record.slice(82,83));
        codaRecord.separateApplicationCode= String(record.slice(83,88));
        codaRecord.transactionReference   = String(record.slice(88,104));
        codaRecord.relatedReference       = String(record.slice(104,120));
        codaRecord.padding4               = String(record.slice(120,127));
        codaRecord.versionCode            = String(record.slice(127,128));
        codaRecord.ID                     = ID

        if( !codaRecord.recordID.includes("0")  )
        {   badRequest.body                = 'Record is not a headerrecord';
            logger.trace(applicationName + ':zndMngCodaFiles:getCodaHeaderRecord0:done.');
            return badRequest;
        }
        if( !codaRecord.recordID.includes("0")  )
        {   badRequest.body                = 'CODA VERSION NOT SUPPORTED!!!!';
            logger.trace(applicationName + ':zndMngCodaFiles:getCodaHeaderRecord0:done.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID ,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaHeaderRecord0:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaHeaderRecord0:done.');
        noError.body                    = codaRecord.statementID;
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaHeaderRecord0:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}



async function getCodaOldBalance1(statementID,record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaOldBalance1:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };

        codaRecord                      = {};
        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = "";
        codaRecord.articleCode          = "";
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.AccountStructure     = String(record.slice(1,2));
        codaRecord.statementSequenceNumber= String(record.slice(2,5));
        codaRecord.accountNRCC          = String(record.slice(5,42));
        codaRecord.oldBalanceSign       = String(record.slice(42,43));
        codaRecord.oldBalance           = String(record.slice(43,58));
        codaRecord.oldBalanceDate       = String(record.slice(58,64));
        codaRecord.accountHolderName    = String(record.slice(64,90));
        codaRecord.accountDescription   = String(record.slice(90,125));
        codaRecord.codedStatementSequenceNumber= String(record.slice(125,128));
        codaRecord.ID                     = ID
        if( !codaRecord.recordID.includes("1")  )
        {   badRequest.body                = 'Record is not a Old Balance Record';
            logger.error(applicationName + ':zndMngCodaFiles:getCodaOldBalance1:done.');
            return badRequest;
        }
        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaHeaderRecord0:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaOldBalance1:done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaOldBalance1:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}


async function getCodaMovementRecord21(statementID,record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaMovementRecord21:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};
        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = String(record.slice(10,31));
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.articleCode          = String(record.slice(1,2));
        codaRecord.continuousSequenceNumber=String(record.slice(2,6));
        codaRecord.detailNumber         = String(record.slice(6,10));
        codaRecord.BankReferenceNumber  = String(record.slice(10,31));
        codaRecord.movementSign         = String(record.slice(31,32));
        codaRecord.amount               = String(record.slice(32,47));
        codaRecord.valueDate            = String(record.slice(47,53));
        codaRecord.transactionCode      = String(record.slice(53,61));
        codaRecord.communicationType    = String(record.slice(61,62));
        codaRecord.communicationZone    = String(record.slice(62,115));
        codaRecord.entryDate            = String(record.slice(115,121));
        codaRecord.statementSequenceNumber=String(record.slice(121,124));
        codaRecord.globalisationCode    = String(record.slice(124,125));
        codaRecord.nextCode             = String(record.slice(125,126));
        codaRecord.padding1             = String(record.slice(126,127));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("2")  )
        {   badRequest.body                = 'Record is not a movementRecord2';
            logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord21:codaRecord doesn\'t include \'2\'.');
            return badRequest;
        }

        if( !codaRecord.articleCode.includes("1")  )
        {   badRequest.body                = 'Record is not a movementRecord21';
            logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord21:codaRecord doesn\'t include \'1\'.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord21:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaMovementRecord21:done.');
        noError.body                    =  codaRecord.BankReferenceNumber;
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaMovementRecord21:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}



async function getCodaMovementRecord22(statementID,transactionID,record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaMovementRecord22:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = transactionID;
        
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.articleCode          = String(record.slice(1,2));
        codaRecord.continuousSequenceNumber = String(record.slice(2,6));
        codaRecord.detailNumber         = String(record.slice(6,10));
        codaRecord.communication        = String(record.slice(10,63));
        codaRecord.customerReference    = String(record.slice(63,98));
        codaRecord.BICCODE              = String(record.slice(98,109));
        codaRecord.padding1             = String(record.slice(109,112));
        codaRecord.RtransactionType     = String(record.slice(112,113));
        codaRecord.ISOReasonReturnCode  = String(record.slice(113,117));
        codaRecord.categoryPurpose      = String(record.slice(117,121));
        codaRecord.purpose              = String(record.slice(121,125));
        codaRecord.nextCode             = String(record.slice(125,126));
        codaRecord.padding2             = String(record.slice(126,127));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("2")  )
        {   badRequest.body                = 'Record is not a movementRecord2';
            logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord21:codaRecord doesn\'t include \'2\'.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord22:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaMovementRecord22:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaMovementRecord22:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}



async function getCodaMovementRecord23(statementID,transactionID, record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaMovementRecord23:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = transactionID;
        
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.articleCode          = String(record.slice(1,2));
        codaRecord.continuousSequenceNumber=String(record.slice(2,6));
        codaRecord.detailNumber         = String(record.slice(6,10));
        codaRecord.counterpartAccountNR = String(record.slice(10,47));
        codaRecord.counterpartName      = String(record.slice(47,82));
        codaRecord.communication        = String(record.slice(82,125));
        codaRecord.nextCode             = String(record.slice(125,126));
        codaRecord.padding1             = String(record.slice(126,127));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("2")  )
        {   badRequest.body                = 'Record is not a movementRecord2';
            logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord23:codaRecord.recordID doesn\'t include \'2\'.');
            return badRequest;
        }

        if( !codaRecord.articleCode.includes("3")  )
        {   badRequest.body                = 'Record is not a movementRecord23'
            logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord23:codaRecord.articleCode. doesn\'t include \'3\'.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaMovementRecord23:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaMovementRecord23:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaMovementRecord23:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}


async function getCodaInformationRecord31(statementID,transactionID,record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaInformationRecord31:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = transactionID;
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.articleCode          = String(record.slice(1,2));
        codaRecord.continuousSequenceNumber = String(record.slice(2,6));
        codaRecord.detailNumber         = String(record.slice(6,10));
        codaRecord.referenceNumber      = String(record.slice(10,31));
        codaRecord.transactionCode      = String(record.slice(31,39));
        codaRecord.communicationZoneCode= String(record.slice(39,40));
        codaRecord.communication        = String(record.slice(40,113));
        codaRecord.padding1             = String(record.slice(113,125));
        codaRecord.nextCode             = String(record.slice(125,126));
        codaRecord.padding1             = String(record.slice(126,127));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("3")  )
        {   badRequest.body                = 'Record is not a movementRecord31'
            logger.error(applicationName + ':zndMngCodaFiles:getCodaInformationRecord31:codaRecord.recordID. doesn\'t include \'3\'.');
            return badRequest;
        }

        if( !codaRecord.articleCode.includes("1")  )
        {   badRequest.body                = 'Record is not a movementRecord31'
            logger.error(applicationName + ':zndMngCodaFiles:getCodaInformationRecord31:codaRecord.articleCode. doesn\'t include \'1\'.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaInformationRecord31:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaInformationRecord31:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaInformationRecord31:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}


async function getCodaInformationRecord32(statementID,transactionID, record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaInformationRecord32:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = transactionID;
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.articleCode          = String(record.slice(1,2));
        codaRecord.continuousSequenceNumber=String(record.slice(2,6));
        codaRecord.detailNumber         = String(record.slice(6,10));
        codaRecord.communication        = String(record.slice(10,115));
        codaRecord.padding1             = String(record.slice(115,125));
        codaRecord.padding1             = String(record.slice(113,125));
        codaRecord.nextCode             = String(record.slice(125,126));
        codaRecord.padding2             = String(record.slice(113,125));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("3")  )
        {   badRequest.body                = 'Record is not a movementRecord 32'
            logger.error(applicationName + ':zndMngCodaFiles:getCodaInformationRecord32:codaRecord.recordID. doesn\'t include \'3\'.');
            return badRequest;
        }

        if( !codaRecord.articleCode.includes("2") )
        {   badRequest.body                = 'Record is not a movementRecord32'
            logger.error(applicationName + ':zndMngCodaFiles:getCodaInformationRecord32:codaRecord.articleCode. doesn\'t include \'2\'.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaInformationRecord32:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaInformationRecord32:Done.');
        return noError;

    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaInformationRecord32:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}



async function getCodainformationRecord33(statementID,transactionID,record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodainformationRecord33:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = transactionID;
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.articleCode          = String(record.slice(1,2));
        codaRecord.continuousSequenceNumber = String(record.slice(2,6));
        codaRecord.detailNumber         = String(record.slice(6,10));
        codaRecord.communication        = String(record.slice(10,100));
        codaRecord.padding1             = String(record.slice(100,125));
        codaRecord.nextCode             = String(record.slice(125,126));
        codaRecord.padding2             = String(record.slice(126,127));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("3")  )
        {   badRequest.body                = 'Record is not a movementRecord 33'
            logger.error(applicationName + ':zndMngCodaFiles:getCodainformationRecord33:codaRecord.recordID. doesn\'t include \'3\'.');
            return badRequest;
        }

        if( !codaRecord.articleCode.includes("3")  )
        {   badRequest.body                = 'Record is not a movementRecord33'
            logger.error(applicationName + ':zndMngCodaFiles:getCodainformationRecord33:codaRecord.articleCode. doesn\'t include \'3\'.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodainformationRecord33:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodainformationRecord33:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodainformationRecord33:An Exception occurred [' + ex + '].');
        exception.body                  = ex;
        return exception;
    }
}



async function getCodafreeCommunicationRecord4(statementID, record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodafreeCommunicationRecord4:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.articleCode          = "";
        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = "";
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.padding1             = String(record.slice(1,2));
        codaRecord.continuousSequenceNumber = String(record.slice(2,6));
        codaRecord.detailNumber         = String(record.slice(6,10));
        codaRecord.padding2             = String(record.slice(10,32));
        codaRecord.communication        = String(record.slice(32,112));
        codaRecord.padding3             = String(record.slice(112,127));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("4")  )
        {   badRequest.body             = 'Record is not a Free Communication Record 4';
            logger.error(applicationName + ':zndMngCodaFiles:getCodafreeCommunicationRecord4:codaRecord.recordID. doesn\'t include \'4\'.');
            return badRequest;
        }

        retVal                          = await storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodafreeCommunicationRecord4:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodafreeCommunicationRecord4:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodafreeCommunicationRecord4:An Exception occurred [' + ex + '].');
        exception.body                  = ex;getCodafreeCommunicationRecord4
        return exception;
    }
}



async function getCodaNewBalance8(statementID, record, ID)
{   try
    {   var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaNewBalance8:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = "";
        codaRecord.articleCode          = "";
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.statementSequenceNumber = String(record.slice(1,4));
        codaRecord.accountNRCC          = String(record.slice(4,41));
        codaRecord.newBalanceSign       = String(record.slice(41,42));
        codaRecord.newBalance           = String(record.slice(42,57));
        codaRecord.newBalanceDate       = String(record.slice(57,63));
        codaRecord.accountHolderName    = String(record.slice(64,90));
        codaRecord.padding              = String(record.slice(90,127));
        codaRecord.linkCode             = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("8")  )
        {   badRequest.body             = 'Record is not a Free Communication Record 8';
            logger.error(applicationName + ':zndMngCodaFiles:getCodaNewBalance8:codaRecord.recordID. doesn\'t include \'8\'.');
            return badRequest;
        }

        retVal                          = await  storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaNewBalance8:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaNewBalance8:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaNewBalance8:An Exception occurred [' + ex + '].');
        exception.body                  = ex;getCodafreeCommunicationRecord4
        return exception;
    }
}



async function getCodaTrailerRecord(statementID, record, ID)
{   try
    {  var badResult, noError, badRequest, codaRecord, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaTrailerRecord:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };
        codaRecord                      = {};

        codaRecord.statementID          = statementID;
        codaRecord.transactionID        = "";
        codaRecord.articleCode          = "";
        codaRecord.recordID             = String(record.slice(0,1));
        codaRecord.padding1             = String(record.slice(1,16));
        codaRecord.numberOfRecords      = String(record.slice(16,22));
        codaRecord.debitMovement        = String(record.slice(22,37));
        codaRecord.creditMovement       = String(record.slice(37,52));
        codaRecord.padding2             = String(record.slice(52,127));
        codaRecord.multipleFileCode     = String(record.slice(127,128));
        codaRecord.ID                   = ID

        if( !codaRecord.recordID.includes("9")  )
        {   badRequest.body             = 'Record is not a Trailer Record 9';
            logger.error(applicationName + ':zndMngCodaFiles:getCodaTrailerRecord:codaRecord.recordID. doesn\'t include \'9\'.');
            return badRequest;
        }

        retVal                          = await  storeInDB(codaRecord.statementID,codaRecord.transactionID,codaRecord.recordID,codaRecord.articleCode,codaRecord.ID,JSON.stringify(codaRecord));

        if ( retVal.returnCode != NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:getCodaTrailerRecord:An error Ocurred ['+ retVal.returnCode +'].');
            return retVal;
        }

        logger.trace(applicationName + ':zndMngCodaFiles:getCodaTrailerRecord:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:getCodaTrailerRecord:An Exception occurred [' + ex + '].');
        exception.body                  = ex;getCodafreeCommunicationRecord4
        return exception;
    }
}


async function manageCodaRecord(record)
{   try
    {   var badResult, noError, badRequest, retVal;

        logger.trace(applicationName + ':zndMngCodaFiles:manageCodaRecord:Started.');

        badResult                           = { ...errorCatalog.badResult  };
        badRequest                          = { ...errorCatalog.badRequest };
        exception                           = { ...errorCatalog.exception  };
        noError                             = { ...errorCatalog.noError    };

        if (record[0] == '0')
        {   ID                              = uuidv4(); 
            retVal                          = await getCodaHeaderRecord0(record, ID);
            if ( retVal.returnCode == NO_ERROR )
            {   StatementID                 = retVal.body;
            }
            else
            {   badResult.body              = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }
        }

        if (record[0] == '1')
        {   retVal                          = await getCodaOldBalance1(StatementID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body              = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }
        }

        if ((record[0] == '2') && (record[1] == '1') )
        {   retVal                          = await getCodaMovementRecord21(StatementID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }
            TransactionID               = retVal.body;
        }



        if ((record[0] == '2') && (record[1] == '2') )
        {   retVal                          = await getCodaMovementRecord22(StatementID,TransactionID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }             
        }        
         
        if ((record[0] == '2') && (record[1] == '3') )
        {   retVal                          = await getCodaMovementRecord23(StatementID,TransactionID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }             
        }        
        
        if ((record[0] == '3') && (record[1] == '1') )
        {   retVal                          = await getCodaInformationRecord31(StatementID,TransactionID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }             
        }
        
        if ((record[0] == '3') && (record[1] == '2') )
        {   retVal                          = await getCodaInformationRecord32(StatementID,TransactionID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }             
        } 
        
        if ((record[0] == '3') && (record[1] == '3') )
        {   retVal                          = await getCodainformationRecord33(StatementID,TransactionID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }             
        }
          
        if ((record[0] == '4')  )
        {   retVal                          = await getCodafreeCommunicationRecord4(StatementID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }             
        }
         
        if ((record[0] == '8')  )
        {   retVal                          = await  getCodaNewBalance8(StatementID,record, ID);
            if ( retVal.returnCode != NO_ERROR )
            {   badResult.body          = retVal.body;
                logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                return badResult;
            }             
        }
         

         if ((record[0] == '9')  )
         {   retVal                          = await  getCodaTrailerRecord(StatementID,record, ID);
             if ( retVal.returnCode != NO_ERROR )
             {   badResult.body          = retVal.body;
                 logger.error(applicationName + ':zndMngCodaFiles:manageCodaRecord:done.');
                 return badResult;
             }             
        }
         
        logger.trace(applicationName + ':zndMngCodaFiles:manageCodaRecord:Done.');
        return noError;

    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:manageCodaRecord:An exception occured:[' + ex + '].')
        exception.body                  = ex;
        return exception;
    }
}

async function parseCodaFile(codaFile)
{   try
    {   var badResult, noError, badRequest, codaData, record, j, recordCount, rcCount, recordString, retval;
        var fileReadFunc, retVal, i;

        logger.trace(applicationName + ':zndMngCodaFiles:parseCodaFile:Started.');

        badResult                           = { ...errorCatalog.badResult  };
        badRequest                          = { ...errorCatalog.badRequest };
        exception                           = { ...errorCatalog.exception  };
        noError                             = { ...errorCatalog.noError    };

        codaData                        = "";
        record                          = "";
        j                               = 0;
        recordCount                     = 0;
        rcCount                         = 0;

        logger.debug(applicationName + ':zndMngCodaFiles:parseCodaFile:Parsing: ['+codaFile+'].')

        fileReadFunc                    = util.promisify(fs.readFile);

        retVal                          = await fileReadFunc(codaFile, 'utf8');

        recordCount                     = retVal.split("\n").length - 1
        for (i =0; i<recordCount; i++)
        {   record = retVal.split("\n")[i];
            if( record.length == 129 )
            {   retval                  = await manageCodaRecord(record);
                if ( retval.returnCode !=  NO_ERROR )
                { logger.error(applicationName + ':zndMngCodaFiles:parseCodaFile:ManageCodaRecord returnmed an error ['+ retval.returnCode +'].');
                  return retval;
                }
                rcCount++;
            }
        }
        logger.debug(applicationName + ':zndMngCodaFiles:parseCodaFile:Records Found: ['+ rcCount +'].');
        zndMsg.eventBus.sendEvent('manageCodaRecords',rcCount)
        noError.body                  = rcCount;
        logger.trace(applicationName + ':zndMngCodaFiles:parseCodaFile:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:parseCodaFile:An exception occured:[' + ex + '].')
        exception.body                  = ex;
        return exception;
    }
}

async function storeCodaFile(files)
{
    try
    {   var badResult, noError, badRequest, codaFile, docPath,retCode;

        logger.trace(applicationName + ':zndMngCodaFiles:storeCodaFile:Started.');

        badResult                       = { ...errorCatalog.badResult  };
        badRequest                      = { ...errorCatalog.badRequest };
        exception                       = { ...errorCatalog.exception  };
        noError                         = { ...errorCatalog.noError    };

        if (Object.keys(files).length == 1 )
        {   logger.debug(applicationName + ':zndMngCodaFiles:storeCodaFile:"Filename is : ['+files.file.name + '].');
            codaFile                    = files.file;
            docPath                     = path.resolve(__dirname,'../public/docs',codaFile.name);
            await codaFile.mv(docPath);
        }
        logger.trace(applicationName + ':zndMngCodaFiles:storeCodaFile:Done.');
        noError.body                  = docPath;
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:storeCodaFile:An exception occured:[' + ex + '].')
        exception.body                  = ex;
        return exception;
    }
}

async function manageCodaFiles(files)
{   var badResult, noError, badRequest

    badResult                           = { ...errorCatalog.badResult  };
    badRequest                          = { ...errorCatalog.badRequest };
    exception                           = { ...errorCatalog.exception  };
    noError                             = { ...errorCatalog.noError    };

    try
    {   var i, codaFile, docPath,retCode;

        logger.trace(applicationName + ':zndMngCodaFiles:manageCodaFiles:Started.');

        retCode                         = await storeCodaFile(files);

        if ( retCode.returnCode !=  NO_ERROR )
        {  logger.error(applicationName + ':zndMngCodaFiles:manageCodaFiles:An error Occurred.');
            return retCode;
        }
        retCode                         = await parseCodaFile(retCode.body)

        if ( retCode.returnCode !=  NO_ERROR )
        {   logger.error(applicationName + ':zndMngCodaFiles:manageCodaFiles:An error Occurred.');
            return retCode;
        }
        noError.body                    = retCode.body;
        logger.trace(applicationName + ':zndMngCodaFiles:manageCodaFiles:Done.');
        return noError;
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:manageCodaFiles:An exception occured:[' + ex + '].')
        exception.body                  = ex;
        return exception;
    }
}

async function main(req, res)
{   try
    {   var result;

        logger.trace(applicationName + ':zndMngCodaFiles:main:Started.');

        result                          = await manageCodaFiles(req.files);
        logger.trace(applicationName + ':zndMngCodaFiles:main:Done.');
        logger.debug(applicationName + ':zndMngCodaFiles:main:returnCode.',result.body);
        res.render('zndLoadCodaFiles' , { result:result });
    }
    catch(ex)
    {   logger.exception(applicationName + ':zndMngCodaFiles:main:An exception occured:[' + ex + '].')
        exception.body                  = ex;
        return exception;
    }
}
/* --------------------------------- End Functions   -------------------------*/

/* ----------------------------------Module Initialization -------------------*/
/* ----------------------------------End Module Initialization ---------------*/

/* ----------------------------------External functions ----------------------*/
module.exports.main                     = main
/* ----------------------------------End External functions ------------------*/


/* LOG:
*/