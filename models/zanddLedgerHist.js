/*
*/

const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const zanddLedgerHistSchema = new Schema( {   accntchk                        :   String,
                                              acountantReference              :   String,
                                              bankAccountNumber               :   String,
                                              bankDate                        :   String,
                                              bankDateEpoch                   :   Number,
                                              bankRecord                      :   String,
                                              bankstatementID                 :   String,
                                              beneficiary                     :   String,
                                              billDescription                 :   String,
                                              billSpecification               :   String,
                                              bkLedgerAccount                 :   String,
                                              bkBookYear                      :   String,
                                              bkNotes                         :   String,
                                              bookedVAT                       :   String,
                                              bookingPeriod                   :   String,
                                              compagnyID                      :   String,
                                              creationDate                    :   Number,
                                              customerReference               :   String,
                                              declarationStatement            :   String,
                                              docPath                         :   String,
                                              docScan                         :   String,
                                              editState                       :   String,
                                              fiatSign                        :   String,
                                              grossAmount                     :   String,
                                              grossAmountNR                   :   Number,
                                              ID                              :   String,
                                              invoiceDate                     :   String,
                                              invoiceDateEpoch                :   Number,
                                              invoiceNumber                   :   String,
                                              ledgerAccount                   :   String,
                                              locked                          :   String,
                                              movementSign                    :   String,
                                              notes                           :   String,
                                              PaymentID                       :   String,
                                              paymentTypes                    :   String,
                                              pendingActions                  :   String,
                                              proofType                       :   String,
                                              transferredAccountant           :   String,
                                              lastTransferredAccountantTime   :   String,
                                              transferredAccountantCount      :   String,
                                              VAT                             :   String,
                                              VATNR                           :   Number,
                                              VATNumber                       :   String,
                                              zndAccountNumber                :   String,
                                              originalRecordID                :   String,
                                              recordTime                      :   Number,
                                              recordStatus                    :   String,
                                              storedVersion                   :   Number
                                          } );


const zanddLedgerHist = mongoose.model( 'zanddLedgerHist',zanddLedgerHistSchema );
module.exports = zanddLedgerHist;
