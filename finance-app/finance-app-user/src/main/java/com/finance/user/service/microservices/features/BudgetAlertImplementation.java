package com.finance.user.service.microservices.features;

import com.finance.user.dto.BudgetModel;
import com.finance.user.dto.features.BudgetAlertDto;
import com.finance.user.feign.BudgetFeignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class BudgetAlertImplementation implements BudgetAlert{

    @Autowired
    protected BudgetFeignClient budgetFeignClient;


    public List<BudgetAlertDto> getBudgetAlerts(int userId) {

//        BudgetModel[] list = restTemplate.getForObject("http://FINANCE-APP-BUDGET/api/budget/"+userId, BudgetModel[].class);
        List<BudgetModel> budgetList = budgetFeignClient.getAllBudgets(userId).getBody();

        List<BudgetAlertDto> alerts = new ArrayList<>();
        for (BudgetModel budget : budgetList) {
            String category = budget.getCategory();
            double currentSpending = budget.getCurrentSpending();
            double moneyLimit = budget.getMoneyLimit();

            if (currentSpending > moneyLimit) {
                alerts.add(new BudgetAlertDto(category, currentSpending, moneyLimit, "Limit crossed!"));
            } else if (currentSpending >= moneyLimit * 0.9) {
                alerts.add(new BudgetAlertDto(category, currentSpending, moneyLimit, "Limit approaching!"));
            } else if (currentSpending == moneyLimit) {
                alerts.add(new BudgetAlertDto(category, currentSpending, moneyLimit, "Current Spending and Limit are equal"));
            } else {
                alerts.add(new BudgetAlertDto(category, currentSpending, moneyLimit, "Current spending is lesser than the limit"));
            }
        }

        return alerts;
    }
}
