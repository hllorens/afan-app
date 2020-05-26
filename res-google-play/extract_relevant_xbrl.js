const yargs = require('yargs');
var fs = require('fs');
var parseString = require('xml2js').parseString;



function getBasicData(xbrl) {
  let ret={};
  let currentEnd = xbrl['dei:DocumentPeriodEndDate'][0]["_"];
  if ((currentEnd).match(/(\d{4})-(\d{1,2})-(\d{1,2})/)) {
    ret.PeriodEndDate=currentEnd;
  } else {
    console.warn(currentEnd + ' is not a date');
    return false;
  }
  ret.contextDuration=xbrl['dei:DocumentPeriodEndDate'][0]["$"]['contextRef'];
  ret.contextInstant=xbrl['dei:EntityCommonStockSharesOutstanding'][0]["$"]['contextRef'];
  if(!getFactValue(xbrl,'us-gaap:Assets',ret.contextInstant)){
    ret.contextInstant=ret.contextDuration.replace('YTD','').replace('FD','FI');
    // depends on the company
    // FI2018Q4  this is for FB... note that some revenue can be get with the other type of instant...
  }

  ret.contextDuration.replace('YTD','').replace('FD','FI');
  ret.fiscalYear=xbrl['dei:DocumentFiscalYearFocus'][0]["_"];
  ret.fiscalPeriod=xbrl['dei:DocumentFiscalPeriodFocus'][0]["_"];
  ret.formType=xbrl['dei:DocumentType'][0]["_"];

  return ret;
}

function get(xbrl,field){
    return xbrl[field][0]["_"];
}

function getFactValue(xbrl, concept, context) {
    if(xbrl[concept]){
        for (var i = 0; i < xbrl[concept].length; i++) {
            if(xbrl[concept][i]['$']['contextRef']==context){
                return Number(xbrl[concept][i]['_']);
            }
        }
        console.log('ERROR '+concept+' with context='+context+' not found. Not looking for the correct context?');
        return false;
    }else{
        console.log('WARNING '+concept+' not found');
        return false;
    }
}


var xml="";
function extract(file){
    fs.readFile(file, 'utf-8', (err, data) => { //./costco_inc_10k.xml
        if (err) throw err; 

        // Converting Raw Buffer to text 
        // data using tostring function. 
        //console.log(data);
            xml=data;

        parseString(xml, function (err, result) {
            if (err) throw err; 
            //console.dir(result);
            let xbrl =result;//["xbrl"]; //result; //JSON.parse(
            if(xbrl.hasOwnProperty('xbrl')){
                xbrl=xbrl["xbrl"];
            }else if(xbrl.hasOwnProperty('xbrli:xbrl')){
                xbrl=xbrl["xbrli:xbrl"];
            }else{
                console.log("ERROR: invalid xbrl");
            }
            //let context=xbrl['context'][0]["$"]["id"];
            //console.log(JSON.stringify(xbrl));
            //return;
            //console.log(Object.keys(xbrl));

            // initialize financials
            var financials=getBasicData(xbrl);


            
            // BALANCE STATEMENT ------------------------------------------------
             
            // Assets
            financials.Assets=getFactValue(xbrl,'us-gaap:Assets',financials.contextInstant) || 0;
            financials.AssetsCurrent=getFactValue(xbrl,'us-gaap:AssetsCurrent',financials.contextInstant) || 0;
            if (financials.Assets !== 0 && financials.AssetsCurrent=== 0) {
                financials.AssetsCurrent=financials.Assets; // fixes costco 2016 and seems that it might happen the other way around 
            }
            if (financials.Assets === 0 && financials.AssetsCurrent!== 0) {
                financials.Assets=financials.AssetsCurrent; // fixes costco 2016 and seems that it might happen the other way around 
            }
            
            /*financials.AssetsNoncurrent=getFactValue(xbrl,'us-gaap:AssetsNoncurrent',financials.contextInstant) || 0;
            if(financials.AssetsNoncurrent == 0){
                if (financials.Assets && financials.AssetsCurrent) {
                    financials.AssetsNoncurrent = financials.Assets - financials.AssetsCurrent;
                }
            }*/

            // Liabilities
            financials.LiabilitiesAndEquity= getFactValue(xbrl,'us-gaap:LiabilitiesAndStockholdersEquity',financials.contextInstant) || 0;
            if(financials.LiabilitiesAndEquity == 0){
                financials.LiabilitiesAndEquity= getFactValue(xbrl,'us-gaap:LiabilitiesAndPartnersCapital',financials.contextInstant) || 0;
            }
            financials.Liabilities=getFactValue(xbrl,'us-gaap:Liabilities',financials.contextInstant) || 0;
            financials.LiabilitiesCurrent=getFactValue(xbrl,'us-gaap:LiabilitiesCurrent',financials.contextInstant) || 0;
            if (financials.Liabilities !== 0 && financials.LiabilitiesCurrent=== 0) {
                financials.LiabilitiesCurrent=financials.Liabilities; // fixes costco 2016 and seems that it might happen the other way around 
            }
            if (financials.Liabilities === 0 && financials.LiabilitiesCurrent!== 0) {
                financials.Liabilities=financials.LiabilitiesCurrent; // fixes costco 2016 and seems that it might happen the other way around 
            }
            /*financials.LiabilitiesNoncurrent=getFactValue(xbrl,'us-gaap:LiabilitiesNoncurrent',financials.contextInstant) || 0;
            if(financials.LiabilitiesNoncurrent == 0){
                if (financials.Liabilities && financials.LiabilitiesCurrent) {
                    financials.LiabilitiesNoncurrent = financials.Liabilities - financials.LiabilitiesCurrent;
                }
            }*/
            
            // Details for quick and cash ratio
            financials.CashAndCashEquivalents=getFactValue(xbrl,'us-gaap:CashAndCashEquivalentsAtCarryingValue',financials.contextInstant) || 0;
            financials.MarketableSecurities=getFactValue(xbrl,'us-gaap:AvailableForSaleSecuritiesDebtSecuritiesCurrent',financials.contextInstant) || 0;
            financials.AccountsRecivable=getFactValue(xbrl,'us-gaap:AccountsReceivableNetCurrent',financials.contextInstant) || 0;
            financials.Goodwill=getFactValue(xbrl,'us-gaap:Goodwill',financials.contextInstant) || 0;

            // Equity to cross-check
                // NOTE: there are other fiedls in case this does not match!
            financials.Equity=getFactValue(xbrl,'us-gaap:StockholdersEquity',financials.contextInstant) || 0;
            if(financials.Equity!=(financials.Assets-financials.Liabilities)){
                console.log('ERROR: Equity!=Assets-Liabilities');
            }
            
            
            // INCOME
            

            // Revenues -> important to see the taxonomy to see if we need to add up something
            financials.Revenue = 
            getFactValue(xbrl,'us-gaap:Revenues',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:SalesRevenueNet',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax',financials.contextDuration) || //from facebook
            getFactValue(xbrl,'us-gaap:SalesRevenueServicesNet',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:RevenuesNetOfInterestExpense',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:HealthCareOrganizationRevenue',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:InterestAndDividendIncomeOperating',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:RealEstateRevenueNet',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:RevenueMineralSales',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:OilAndGasRevenue',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:FinancialServicesRevenue',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:RegulatedAndUnregulatedOperatingRevenue',financials.contextDuration) || 0;
                
            /*// CostOfRevenue
            financials.CostOfRevenue = 
            getFactValue(xbrl,'us-gaap:CostOfRevenue',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:CostOfServices',financials.contextDuration) ||
            getFactValue(xbrl,'us-gaap:CostOfGoodsSold',financials.contextDuration) || 
            getFactValue(xbrl,'us-gaap:CostOfGoodsAndServicesSold',financials.contextDuration) || 0;
            // don't need so much just op income
            us-gaap:CostsAndExpenses (to form Operating Income...)
            */
            
            financials.OperatingIncomeLoss= getFactValue(xbrl,'us-gaap:OperatingIncomeLoss',financials.contextDuration) || 0;
            //financials.IncomeTaxExpenseBenefit= getFactValue(xbrl,'us-gaap:IncomeTaxExpenseBenefit',financials.contextDuration) || 0; // provision for taxes...
            financials.NetIncomeLoss= getFactValue(xbrl,'us-gaap:NetIncomeLoss',financials.contextDuration) || 0;

            // Shares
            financials.SharesBasic= getFactValue(xbrl,'us-gaap:WeightedAverageNumberOfSharesOutstandingBasic',financials.contextDuration) || 0;
            // if we want to be stricter...
            // if all options, warrants, etc were exercised
            // we default to basic in case diluted is not specified...
            financials.SharesDiluted= getFactValue(xbrl,'us-gaap:WeightedAverageNumberOfDilutedSharesOutstanding',financials.contextDuration) || financials.SharesBasic; 

            // calcul burdo
            financials.CashPerShare=financials.CashAndCashEquivalents/financials.SharesDiluted;
            financials.QuickPerShare=(financials.CashAndCashEquivalents+financials.MarketableSecurities)/financials.SharesDiluted;
            financials.OperatingPerShare=financials.OperatingIncomeLoss/financials.SharesDiluted;
            financials.FairPrice1=financials.CashPerShare+financials.OperatingPerShare*6; // I normally do a formula with growth... and multiply per 5 (PER of 5, without taxes)
                                                                                          // if we can calculate earnings from operating we could just use that... or subtrack operating - taxes...
            console.log('data='+JSON.stringify(financials,null,2));
        });

    });
}

(function main(){
    const argv = yargs
        .option('file', {
            alias: 'f',
            description: 'The file to use',
            type: 'string',
        })
        .option('debug', {
            alias: 'd',
            description: 'More logging...?',
            type: 'boolean',
        })
        .help()
        .alias('help', 'h')
        .usage('Usage: $0 -f file [-d] [-h]')
        .demandOption(['file'])
        .argv;
        
    extract(argv.file);

})();

