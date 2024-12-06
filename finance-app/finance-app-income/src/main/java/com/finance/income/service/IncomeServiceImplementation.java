package com.finance.income.service;

import com.finance.income.model.IncomeModel;
import com.finance.income.repository.IncomeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class IncomeServiceImplementation implements IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Override
    public IncomeModel save(IncomeModel income) {
        return incomeRepository.save(income);
    }

    @Override
    public List<IncomeModel> getAllIncomes(int userId) {
        return incomeRepository.findIncomesOfUser(userId);
    }

    @Override
    public IncomeModel updateBySource(int id, IncomeModel income) {

        IncomeModel incomeModel = incomeRepository.findById(id).orElse(null);

        if(income.getAmount() > 0){
            incomeModel.setAmount(income.getAmount());
        }
        if(income.getSource() != null){
            incomeModel.setSource(income.getSource());
        }
        if(income.getCategory() != null){
            incomeModel.setCategory(income.getCategory());
        }
        if(income.getDate() != null){
            incomeModel.setDate(income.getDate());
        }
        incomeModel.setRecurring(income.isRecurring());

        return save(incomeModel);
    }

    @Override
    public void deleteParticularIncomeBySource(int id) {
        incomeRepository.deleteById(id);
    }
}
