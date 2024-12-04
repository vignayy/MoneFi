package com.finance.income.service;

import com.finance.income.model.IncomeModel;

import java.util.List;

public interface IncomeService {

    public IncomeModel save(IncomeModel income);

    List<IncomeModel> getAllIncomes(int userId);

    public IncomeModel updateBySource(int userId, String source, IncomeModel income);

    public void deleteParticularIncomeBySource(int id);

}
