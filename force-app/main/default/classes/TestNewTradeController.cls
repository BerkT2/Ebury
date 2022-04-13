@isTest
public class TestNewTradeController {
    
    static testMethod void testGetTradeInfo() {
        Test.setMock(HttpCalloutMock.class, new API_ResponseMock());
        Test.startTest();
        Decimal rate = NewTradeController.getTradeInfo('USD', 'USD');
        Test.stopTest();
        
        System.assertEquals(1, rate);
    }
    
    static testMethod void testgetAllTrades() {
        Trade__c t1 = new Trade__c();
        Trade__c t2 = new Trade__c();
        
        insert t1;
        insert t2;
        
        Test.startTest();
        List<Trade__c> tList = NewTradeController.getAllTrades();
        Test.stopTest();

        System.assertEquals(2, tList.size());
    }
    
    static testMethod void testcreateNewTrade() {
        Test.startTest();
        Trade__c t = NewTradeController.createNewTrade('USD', 'EUR', 10, 1.2);
        Test.stopTest();
        
        System.assertEquals('USD', t.Sell_Currency__c);
        System.assertEquals('EUR', t.Buy_Currency__c);
        System.assertEquals(10, t.Sell_Amount__c);
        System.assertEquals(1.2, t.Rate__c);
        System.assertEquals(12, t.Buy_Amount__c);
    }
}