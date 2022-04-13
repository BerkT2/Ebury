@isTest
public class API_ResponseMock implements HttpCalloutMock {
    public HTTPResponse respond(HTTPRequest request) {
        // Creating a fake response for testing
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"success":true,"timestamp":1649733423,"base":"EUR","date":"2022-04-12","rates":{"USD":1.087489,"GBP":0.835142,"EUR":1}}');
        response.setStatusCode(200);
        return response;
    }
}