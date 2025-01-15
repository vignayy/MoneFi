package com.finance.income.service;

import com.finance.income.model.IncomeModel;

import java.util.List;

public interface IncomeService {

    public IncomeModel save(IncomeModel income);

    List<IncomeModel> getAllIncomes(int userId);

    public List<IncomeModel> getAllIncomesByDate(int userId, int month, int year);

    public List<IncomeModel> getAllIncomesByYear(int userId, int year);

    public List<Double> getMonthlyIncomes(int userId, int year);

    public IncomeModel updateBySource(int id, IncomeModel income);

    public void deleteParticularIncomeBySource(int id);

}
