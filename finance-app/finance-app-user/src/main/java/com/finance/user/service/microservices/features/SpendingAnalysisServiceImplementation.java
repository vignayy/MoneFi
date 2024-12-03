package com.finance.user.service.microservices.features;

import com.finance.user.dto.features.ExpenseDto;
import com.finance.user.dto.features.SpendingPatternDto;
import com.finance.user.feign.ExpenseFeignClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SpendingAnalysisServiceImplementation implements SpendingAnalysisService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ExpenseFeignClient expenseFeignClient;

    @Override
    public List<SpendingPatternDto> analyzeSpendingPattern(int userId) {

        LocalDate currentStart = LocalDate.now().withDayOfMonth(1); // Start of this month
        LocalDate currentEnd = currentStart.plusMonths(1).minusDays(1); // End of this month
        LocalDate previousStart = currentStart.minusMonths(1); // Start of last month
        LocalDate previousEnd = currentStart.minusDays(1); // End of last month


        // Fetch categorized expenses for current and previous months
//        ExpenseDto[] currentResponse = restTemplate.getForObject("http://FINANCE-APP-EXPENSE/api/expense/analysis/" + userId + "/" + currentStart + "/" + currentEnd, ExpenseDto[].class);
//        ExpenseDto[] previousResponse = restTemplate.getForObject("http://FINANCE-APP-EXPENSE/api/expense/analysis/" + userId + "/" + previousStart + "/" + previousEnd, ExpenseDto[].class);

        List<ExpenseDto> currentExpenses = expenseFeignClient.getExpensesByCategoryAndPeriod(userId, currentStart, currentEnd).getBody();
        System.out.println(currentExpenses);
        List<ExpenseDto> previousExpenses = expenseFeignClient.getExpensesByCategoryAndPeriod(userId, previousStart, previousEnd).getBody();

        // Convert previous expenses lists to a map for easier traversal and compare
        Map<String, Double> previousExpensesMap = previousExpenses.stream()
                .collect(Collectors.toMap(ExpenseDto::getCategory, ExpenseDto::getTotalSpent, (a, b) -> b));

        List<SpendingPatternDto> insights = new ArrayList<>();

        for (ExpenseDto currentExpense : currentExpenses) {
            String category = currentExpense.getCategory();
            double currentTotal = currentExpense.getTotalSpent();
            double previousTotal = previousExpensesMap.getOrDefault(category, 0.0);

            // Calculate the percentage change in spending
            double percentageChange = previousTotal == 0 ? 100 : ((currentTotal - previousTotal) / previousTotal) * 100;

            // Generate insight message
            String insightMessage;
            if (percentageChange > 20) {
                insightMessage = "Your " + category + " expenses are " + String.format("%.2f", percentageChange) + "% higher this month compared to last month.";
            } else if (percentageChange < -20) {
                insightMessage = "Good job! Your " + category + " expenses are " + String.format("%.2f", Math.abs(percentageChange)) + "% lower this month compared to last month.";
            } else {
                insightMessage = "Your " + category + " spending is consistent with last month.";
            }

            insights.add(new SpendingPatternDto(category, currentTotal, previousTotal, insightMessage));
        }

        return insights;
    }
}

