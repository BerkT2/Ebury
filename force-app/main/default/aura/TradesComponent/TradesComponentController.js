({
    init: function (component, event, helper) {
        //setting the columns on init
        component.set('v.columns', [
            {label: 'Sell CCY', fieldName: 'Sell_Currency__c', type: 'text'},
            {label: 'Sell Amount', fieldName: 'Sell_Amount__c', type: 'number', typeAttributes: {maximumSignificantDigits: 2}},
            {label: 'Buy CCY', fieldName: 'Buy_Currency__c', type: 'text'},
            {label: 'Buy Amount', fieldName: 'Buy_Amount__c', type: 'number', typeAttributes: {maximumSignificantDigits: 2}},
            {label: 'Rate', fieldName: 'Rate__c', type: 'number', typeAttributes: {maximumSignificantDigits: 4}},
            {label: 'Date Booked', fieldName: 'Date_Booked__c', type: 'datetime'}
        ]);
        
        //calling getData method from helper to fill the data to the table
        helper.getData(component, event, helper);
    }
});