package com.finance.user.service.microservices.features;

import com.finance.user.dto.ExpenseModel;
import com.finance.user.dto.IncomeModel;
import com.finance.user.dto.features.MonthlyAndYearlySummaryDto;
import com.finance.user.feign.ExpenseFeignClient;
import com.finance.user.feign.IncomeFeignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class MonthlyAndYearlySummaryImplementation implements MonthlyAndYearlySummary {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private IncomeFeignClient incomeFeignClient;
    @Autowired
    private ExpenseFeignClient expenseFeignClient;

    @Override
    public MonthlyAndYearlySummaryDto getMonthlySummary(int userId, int month, int year) {

//        IncomeModel[] list = restTemplate.getForObject("http://FINANCE-APP-INCOME/api/income/"+userId, IncomeModel[].class);
//        List<IncomeModel> incomesList = new ArrayList<>(Arrays.asList(list));
        List<IncomeModel> incomesList = incomeFeignClient.getAllIncomes(userId).getBody();
        double totalMonthlyIncome = incomesList.stream()
                .filter(i -> {
                    LocalDate respectiveDate = i.getDate();
                    return respectiveDate.getMonthValue() == month && respectiveDate.getYear() == year;
                })
                .mapToDouble(i -> i.getAmount())
                .sum();

//        ExpenseModel[] list2 = restTemplate.getForObject("http://FINANCE-APP-EXPENSE/api/expense/" + userId, ExpenseModel[].class);
//        List<ExpenseModel> expensesList = new ArrayList<>(Arrays.asList(list2));
        List<ExpenseModel> expensesList = expenseFeignClient.getAllExpenses(userId).getBody();
        double totalMonthlyExpenses = expensesList.stream()
                .filter(i -> {
                    LocalDate respectiveDate = i.getDate();
                    return respectiveDate.getMonthValue() == month && respectiveDate.getYear() == year;
                })
                .mapToDouble(i -> i.getAmount())
                .sum();

        return new MonthlyAndYearlySummaryDto(totalMonthlyIncome, totalMonthlyExpenses, totalMonthlyIncome - totalMonthlyExpenses);
    }


    @Override
    public MonthlyAndYearlySummaryDto getYearlySummary(int userId, int year) {
//        IncomeModel[] list = restTemplate.getForObject("http://FINANCE-APP-INCOME/api/income/" + userId, IncomeModel[].class);
//        List<IncomeModel> incomesList = new ArrayList<>(Arrays.asList(list));
        List<IncomeModel> incomesList = incomeFeignClient.getAllIncomes(userId).getBody();
        double totalMonthlyIncome = incomesList.stream()
                .filter(i -> {
                    LocalDate respectiveDate = i.getDate();
                    return respectiveDate.getYear() == year;
                })
                .mapToDouble(i -> i.getAmount())
                .sum();

//        ExpenseModel[] list2 = restTemplate.getForObject("http://FINANCE-APP-EXPENSE/api/expense/" + userId, ExpenseModel[].class);
//        List<ExpenseModel> expensesList = new ArrayList<>(Arrays.asList(list2));
        List<ExpenseModel> expensesList = expenseFeignClient.getAllExpenses(userId).getBody();
        double totalMonthlyExpenses = expensesList.stream()
                .filter(i -> {
                    LocalDate respectiveDate = i.getDate();
                    return respectiveDate.getYear() == year;
                })
                .mapToDouble(i -> i.getAmount())
                .sum();

        return new MonthlyAndYearlySummaryDto(totalMonthlyIncome, totalMonthlyExpenses, totalMonthlyIncome - totalMonthlyExpenses);
    }
}
