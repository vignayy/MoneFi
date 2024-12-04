package com.finance.user.service.microservices.expense;

import com.finance.user.dto.BudgetModel;
import com.finance.user.dto.ExpenseModel;
import com.finance.user.feign.BudgetFeignClient;
import com.finance.user.feign.ExpenseFeignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class UserExpenseServiceImplementation implements UserExpenseService {

    @Autowired
    private ExpenseFeignClient expenseFeignClient;

    @Autowired
    private BudgetFeignClient budgetFeignClient;


    @Override
    public ExpenseModel addExpense(int userId, ExpenseModel expense) {
        expense.setUserId(userId);
        ExpenseModel expenseResponse = expenseFeignClient.saveExpense(expense).getBody();

        BudgetModel budget = new BudgetModel();
        budget.setUserId(userId);
        budget.setCategory(expense.getCategory());
        budget.setCurrentSpending(expense.getAmount());
        BudgetModel budgetResponse = budgetFeignClient.saveBudget(budget).getBody();
        System.out.println(budgetResponse);
        return expenseResponse;
    }

    @Override
    public List<ExpenseModel> getAllExpenses(int userId) {
        return expenseFeignClient.getAllExpenses(userId).getBody();
    }

    @Override
    public List<ExpenseModel> updateExpense(int userId, ExpenseModel expense) {
        expense.setUserId(userId);
        expenseFeignClient.updateExpense(userId, expense.getCategory(), expense);
        return expenseFeignClient.getAllExpenses(userId).getBody();
    }

    @Override
    public boolean deleteExpenseById(int id) {

        try {
            expenseFeignClient.deleteExpenseById(id);
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        }
    }
}
