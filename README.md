# Salesforce Ebury Test  
  
### Description  
  
This repository contains the project completed by Berk TOKGÖZ in 14/04/2022. The instructions are followed from the pdf sent by Ebury.  
  
## REQ1  
A new App called Ebury Trade App is created containg a new tab called Trades.  
A new object with the API Name Trade__c has been created. This object contains following fields:  
-ID (API:Name) Format: TR-{0000000}  
-Sell Currency (API: Sell_Currency__c) Format: Picklist (Values retrieved from Global picklist value set)  
-Sell Amount (API: Sell_Amount__c) Format: Number(16,2)  
-Buy Currency (API: Buy_Currency__c) Format: Picklist (Values retrieved from Global picklist value set)  
-Buy Amount (API: Buy_Amount__c) Format: Number(16,2)  
-Rate (API: Rate__c) Format: Number(14,4)  
-Date Booked (API: Date_Booked__c) Format: Date/Time  
  
## REQ2  
  
-Two components were created (TradesComponent.cmp, NewTradeComponent.cmp). TradesComponent contains a table containing all the records created from the object Trade__c. The columns of the table are all the fields mentioned in REQ1. The table is not created using lightning:datatable since it is not supported on mobile devices, insted it has been build with standart table-row system and aura:iteration. The version where the table is built with lightning:datatable is below in the  Additional section.  
-On the right up corner of the (Inside the TradesComponent.cmp as a child component) table is another component called NewTradeComponent. This is a button with the label 'New Trade'. On clicked a pop up opens with the necessary fields {Sell Currency, Sell Amount, Buy Currency, Buy Amount (disabled) and Rate (disabled)}. Buy Amount and Rate fields are automatically calculated. After filling the fields pressing 'Create' button will close the pop up and display a notification telling that the Trade is created and it is added to the table.  
  
## REQ3  
A process has been built with process builder to send a post on chatter everytime after a Trade was created. Unfortunately the process couldn't be pushed to this repository. The error could not be solved therefor the screenshot of the process is uploaded below to investigate.    
  
![image](https://user-images.githubusercontent.com/30245886/163286174-23286e36-1f85-4927-baee-9011169a17cf.png)
  
## REQ4  
First of all remote site settings has been modified and given access to fixer.io. The method called  getTradeInfo() in the Apex class (NewTradeController.apxc) first gets the values from the global currency picklist. And then prepares a request to make call out. In  this request the currency values are added at the end of the endpoint (So that the code doesn't have to be modified in the future in case of the currency values change, a modification to the global picklist value set is enough). The method then calculates the rate with the given parameters and returns the rate. This rate variable is passed to the NewTradeComponent and the getTradeInfo() method is called everytime spesific fields change.  
  
## REQ5  
  
The repository is ready to be deployed using salesforce cli and sfdx. In order to deploy the project you will have to follow these instructions:  
1-Create a new file that will be used to store the project on your PC.  
2-Open CMD and clone this repository. (git clone https://github.com/BerkT2/Ebury)  
3-After the project is on your computer, open VS Code and then the file.  
4-With the SFDX commands Create a Default Scracth Org.  
5-When your org is created you can check if it worked by using the SFDX command Open Default Org.  
6-Now you will deploy the files to this org. Use SFDX command Push Source to Default Scratch Org.  
7-The deployment is succesfull. You can now open the App Called Ebury Trade App. There should be one tab called Trades.    
  
*Note: If you are not able to see the app, the tab or cannot use the components you might have to give permissions to the user.  
  
## Additional  
-Test classes are created for the NewTradeController.apxc class. Because the method containing the callout cannot be tested, a fake mockup class is created with the name API_ResponseMock. With the help of API_ResponseMock test coverage for NewTradeController.apxc is 100%.  
-The code contains comments on every method and on the component, explainig what was intended.  
-The code has been built in a way that future changes won't effect it. (Such as the currency system mentioned in REQ4.  
-Code of the table if it was built with lightning:datatable  

CMP:  

        <div class="slds-p-around_x-small">
          <lightning:datatable
                keyField="id"
                data="{! v.data }"
                columns="{! v.columns }"
                hideCheckboxColumn="true"/>        
        </div>


JS Controller:  

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
        
