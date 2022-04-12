public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        List<Account> AccountList = new List<Account>();
        AccountList = [SELECT Id, Name, Rating FROM Account];
        return AccountList;
    }

    @AuraEnabled
    public static void deleteAccount(String accountId){
        delete[SELECT Id FROM Account WHERE id =: accountId];
    }
}
