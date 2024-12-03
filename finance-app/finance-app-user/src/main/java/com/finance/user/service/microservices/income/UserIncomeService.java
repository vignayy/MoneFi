package com.finance.user.service.microservices.income;


import com.finance.user.dto.IncomeModel;

import java.util.List;

public interface UserIncomeService {
    public IncomeModel addIncome(int userId, IncomeModel income);

    public List<IncomeModel> getAllIncomes(int userId);

    public List<IncomeModel> updateIncome(int userId, IncomeModel income);

    public boolean deleteIncomeBySource(int userId, String source);
}
