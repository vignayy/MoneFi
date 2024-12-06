package com.finance.expense.service;

import com.finance.expense.model.ExpenseModel;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {

    public ExpenseModel save(ExpenseModel expense);

    public List<ExpenseModel> getAllexpenses(int userId);

    public ExpenseModel updateBySource(int id, ExpenseModel expense);

    public void deleteExpenseById(int id);

}
