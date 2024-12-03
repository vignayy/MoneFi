package com.finance.user.dto.features;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExpenseDto {
    private String category;
    private double totalSpent;

    public ExpenseDto(String category, double totalSpent) {
        this.category = category;
        this.totalSpent = totalSpent;
    }
}
