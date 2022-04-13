({
	getData : function(component, event, helper) {
        //Calling apex method which returns SOQL for all the trades inserted
		var action = component.get("c.getAllTrades");
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.data", response.getReturnValue());
                }
                else if (state === "INCOMPLETE") {
                    alert("From server: " + response.getReturnValue());
                }
                    else if (state === "ERROR") {
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
})