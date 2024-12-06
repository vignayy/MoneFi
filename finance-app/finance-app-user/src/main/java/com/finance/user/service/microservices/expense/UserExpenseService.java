package com.finance.user.service.microservices.expense;

import com.finance.user.dto.ExpenseModel;

import java.util.List;

public interface UserExpenseService {
    public ExpenseModel addExpense(int userId, ExpenseModel expense);

    public List<ExpenseModel> getAllExpenses(int userId);

    public ExpenseModel updateExpense(int id, ExpenseModel expense);

    public boolean deleteExpenseById(int id);
}
