package com.finance.user.dto.features;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyAndYearlySummaryDto {
    private double income;
    private double expenses;
    private double savings;
}
