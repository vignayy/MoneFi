package com.finance.user.dto.features;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BudgetAlertDto {
    private String category;
    private double currentSpending;
    private double budgetLimit;
    private String alertMessage;
}
