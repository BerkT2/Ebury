public class NewTradeController {
	
    @AuraEnabled
    public static List<String> getCurrenciesFromGlobalPicklist(){
        //Getting the currencies from the global picklist in order to add it to the request url and to the picklists in the component
        SObjectField picklistUsingGlobal = SObjectType.Trade__c.fields.Sell_Currency__c.getSObjectField();
        List<PicklistEntry> entries = picklistUsingGlobal.getDescribe().getPicklistValues();
        List<String> currencies = new List<String>();
        for(integer i = 0; i < entries.size(); i++){
            currencies.add(entries[i].getValue());
        }
        return currencies;
    }
    
    @AuraEnabled
    public static Decimal getTradeInfo(String sellCurr, String buyCurr){
        //Getting the currencies from the global picklist and adding them to the endpoint will allow users to add additional currencies in the future and don't have to update the code
        List<String> currencies = getCurrenciesFromGlobalPicklist();
        String currenciesToAddOnEndpoint = '';
        for(String s : currencies){
            currenciesToAddOnEndpoint += s + ',';
        }
        
        //Creating a new request to fixer.io and sending it
        Http h = new Http();
		HttpRequest req = new HttpRequest();
        req.setEndpoint('http://data.fixer.io/api/latest?access_key=1773e6d62bfda239e0d3e3fc96a3b737&symbols=' + currenciesToAddOnEndpoint);
        req.setMethod('GET');
        HttpResponse res = h.send(req);
         
        //Mapping the response so it is useable
        Map<String,Object> JsonBody = (Map<String,Object>)json.deserializeUnTyped(res.getBody());
		Map<String,Object> rates = (Map<String,Object>)JsonBody.get('rates');
        
        //Calculating the rate with the values from the parameters and returning it
		//There are no if statements to check the values if they are correct since this is already done in the component to increase optimization
        Decimal rate = (Decimal) rates.get(buyCurr) / (Decimal) rates.get(sellCurr);
        return rate;
    }
    
    @AuraEnabled
    public static List<Trade__c> getAllTrades(){
        //Selecting and returning all the fields that will be displayed in the datatable
        return [SELECT Id, Name, Sell_Amount__c, Buy_Amount__c, Rate__c, Date_Booked__c, Sell_Currency__c, Buy_Currency__c 
                FROM Trade__c
                ORDER BY Date_Booked__c DESC];
    }
    
    @AuraEnabled
    public static Trade__c createNewTrade(String sellCurr, String buyCurr, Decimal sellAmount, Decimal rate){
        //Creating a new trade with the values from the parameters
		//There are no if statements to check the values if they are correct since this is already done in the component to increase optimization
        Trade__c newTrade = new Trade__c();
        
        newTrade.Sell_Amount__c = sellAmount;
        newTrade.Buy_Currency__c = buyCurr;
        newTrade.Sell_Currency__c = sellCurr;
        newTrade.Date_Booked__c = DateTime.now();
        newTrade.Buy_Amount__c = rate*sellAmount;
        newTrade.Rate__c = rate;
        
        insert newTrade;
        return newTrade;

    }
}