package com.finance.user.service.microservices.features;


import com.finance.user.dto.features.MonthlyAndYearlySummaryDto;

public interface MonthlyAndYearlySummary {

    MonthlyAndYearlySummaryDto getMonthlySummary(int id, int month, int year);

    MonthlyAndYearlySummaryDto getYearlySummary(int id, int year);
}
