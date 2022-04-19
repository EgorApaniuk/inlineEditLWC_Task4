public class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        List<Account> accounts = new List<Account>();
        accounts = [SELECT Id, Name, Rating FROM Account];
        return accounts;
    }

    @AuraEnabled
    public static void deleteAccount(String accountId) {
        delete[SELECT Id FROM Account WHERE Id =: accountId];
    }
}
