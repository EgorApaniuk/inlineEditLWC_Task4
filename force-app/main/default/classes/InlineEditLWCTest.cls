@isTest public with sharing class InlineEditLWCTest {
    @isTest static void testGetAccount(){
        Account testAccount = new Account();
        testAccount.Rating = 'Hot';
        testAccount.Name = 'TestAccount';
       	insert testAccount; 
        
        Test.startTest();
        List<Account> testArrayA = accountController.getAccounts();
        Test.stopTest();
        
        System.assertEquals(testArrayA.size(), 1, 'account found'); // positive test of getting acc
    }


    @IsTest static void testDeleteAccount(){
		
        Account testAccount = new Account();
        testAccount.Name = 'test';
       	testAccount.Rating = 'Hot';
       	insert testAccount;  
        
        Test.startTest();
        List<Account> testArrayB = [SELECT Id FROM Account WHERE Name = 'test'];
        accountController.deleteAccount(testArrayB[0].id);
        List<Account> testArrayC = [SELECT Id FROM Account WHERE Name = 'test'];
        Test.stopTest();

        System.assert(testArrayC.isEmpty(),'Account was successfully deleted'); // positive test of deleting acc
    }


    // negative delete test
    @IsTest static void testDeleteAccountNegative(){
        String wrongId = '0065g00000KcEUKAA3';
        Test.startTest(); 
        try{ 
            AccountController.deleteAccount(wrongId);
        }
        catch(DmlException e){
            System.assertEquals(true, false);
        }
        Test.stopTest(); 
    }
}