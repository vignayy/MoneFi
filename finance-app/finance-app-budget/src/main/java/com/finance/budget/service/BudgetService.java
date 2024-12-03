package com.finance.budget.service;

import com.finance.budget.model.BudgetModel;

import java.util.List;

public interface BudgetService {

    public BudgetModel save(BudgetModel budget);

    public List<BudgetModel> getAllBudgets(int userId);

    public BudgetModel updateByCategory(int userId, String category, BudgetModel budget);

    public void deleteParticularBudgetByCategory(int userId, String category);
}
