@isTest
public class AccountControllerTest {

    @isTest 
    static void testGetAccount() {
        Account account = new Account();
        account.Rating = 'Hot';
        account.Name = 'TestAccount';
       	insert account; 
        
        Test.startTest();
        List<Account> testArray = AccountController.getAccounts();
        Test.stopTest();
        
        System.assertEquals(testArray.size(), 1, 'account not found');
    }


    @IsTest 
    static void testDeleteAccount() {
		Account account = new Account();
        account.Name = 'test';
        account.Rating = 'Hot';
       	insert account;  
        
        Test.startTest();
        List<Account> testArrayA = [SELECT Id FROM Account WHERE Name = 'test'];
        AccountController.deleteAccount(testArrayA[0].id);
        List<Account> testArrayB = [SELECT Id FROM Account WHERE Name = 'test'];
        Test.stopTest();

        System.assertEquals(testArrayB.size(), 0, 'Account was deleted'); 
    }


    @IsTest 
    static void testDeleteAccountNegative() {
        String wrongId = '0065g00000KcEUKAA3';
        Test.startTest(); 
        try{ 
            AccountController.deleteAccount(wrongId);
        } catch(DmlException e) {
            System.assertEquals(true, false);
        }
        Test.stopTest(); 
    }
}