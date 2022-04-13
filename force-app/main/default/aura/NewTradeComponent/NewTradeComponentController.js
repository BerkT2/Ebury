({ 
    doInit: function(component) {
         var action = component.get("c.getCurrenciesFromGlobalPicklist");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.currencies", response.getReturnValue());
                }
                else if (state === "INCOMPLETE") {//if we get an error we will alert it here
                    alert("From server: " + response.getReturnValue());
                }
                    else if (state === "ERROR") {//if we get an error we will log it here
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                            errors[0].message);
                            }
                        } else {
                            console.log("Unknown error");
                        }
                    }
            });
            $A.enqueueAction(action);
    },
    
    onCurrChange : function(component, event, helper){
        //On currency change this method will go to the apex method which will make the request to fixer.io
        if( component.get("v.sellCurr") != "" &&  component.get("v.buyCurr")!= ""){//Checking currency values so we don't have to do it in apex controller
            var action = component.get("c.getTradeInfo");
            action.setParams({ sellCurr : component.get("v.sellCurr"),
                              buyCurr : component.get("v.buyCurr") });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    //Setting rate and buy amount values after success
                    component.set("v.rate", response.getReturnValue());
                    component.set("v.buyAmount", component.get("v.sellAmount")*component.get("v.rate"));
                }
                else if (state === "INCOMPLETE") {//if we get an error we will alert it here
                    alert("From server: " + response.getReturnValue());
                }
                    else if (state === "ERROR") {//if we get an error we will log it here
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                            errors[0].message);
                            }
                        } else {
                            console.log("Unknown error");
                        }
                    }
            });
            $A.enqueueAction(action);
        }
    },
    
    onAmountChange : function(component, event, helper){
        //Calculating the buy amount field every time the sell amount field is updated
        if(component.get("v.rate") != 0){
            component.set("v.buyAmount", component.get("v.sellAmount")*component.get("v.rate"));
        }
    },
    
    createTrade : function(component, event, helper){
        //Creating a new trade with the values given from the user
        if(component.get("v.sellCurr") != '' && component.get("v.buyCurr") != '' && component.get("v.sellAmount") > 0){//Checking values so we don't have to do it in apex controller
            var action = component.get("c.createNewTrade");
            action.setParams({ sellCurr : component.get("v.sellCurr"),
                              buyCurr : component.get("v.buyCurr"),
                              sellAmount : component.get("v.sellAmount"), 
                              rate : component.get("v.rate") });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log(state);
                if (state === "SUCCESS") {//closing the modal and showing a toast according to the succes of the action 
                    helper.showToast("Success", "Trade created sucessfully!", "success");
                    component.set("v.isModalOpen", false);
                    $A.get('e.force:refreshView').fire();
                }
                else if (state === "INCOMPLETE") {
                    alert("From server: " + response.getReturnValue());
                    helper.showToast("Error", response.getReturnValue(), "error");
                }
                    else if (state === "ERROR") {
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                            errors[0].message);
                                helper.showToast("Error", errors[0].message, "error");
                            }
                                helper.showToast("Error", 'Something went wrong', "error");
                        } else {
                            console.log("Unknown error");
                            helper.showToast("Error", "Unknown error", "error");
                        }
                    }
            });
            $A.enqueueAction(action);   
        }else{
            helper.showToast("Warning", "Please fill all the fields!", "warning");
        }
    },
    
    openModel: function(component, event, helper) {
        // Set isModalOpen attribute to true
        component.set("v.isModalOpen", true);
    },
    
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to false  
        component.set("v.isModalOpen", false);
    }
})