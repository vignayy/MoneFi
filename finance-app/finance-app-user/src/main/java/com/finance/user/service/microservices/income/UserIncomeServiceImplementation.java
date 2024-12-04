package com.finance.user.service.microservices.income;

import com.finance.user.dto.IncomeModel;
import com.finance.user.feign.IncomeFeignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class UserIncomeServiceImplementation implements UserIncomeService {

    @Autowired
    private IncomeFeignClient incomeFeignClient;


    @Override
    public IncomeModel addIncome(int userId, IncomeModel income) {
        income.setUserId(userId);
        return incomeFeignClient.saveIncome(income).getBody();
    }

    @Override
    public List<IncomeModel> getAllIncomes(int userId) {
        return incomeFeignClient.getAllIncomes(userId).getBody();
    }

    @Override
    public List<IncomeModel> updateIncome(int userId, IncomeModel income) {
        income.setUserId(userId);
        incomeFeignClient.updateIncome(userId, income.getSource(), income);
        return incomeFeignClient.getAllIncomes(userId).getBody();
    }

    @Override
    public boolean deleteIncomeById(int id) {

        try {
            incomeFeignClient.deleteIncomeById(id);
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        }
    }

}
