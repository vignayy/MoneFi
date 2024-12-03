package com.finance.user.dto.features;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpendingPatternDto {
    private String category;
    private double currentPeriodTotal;
    private double previousPeriodTotal;
    private String insight;
}

