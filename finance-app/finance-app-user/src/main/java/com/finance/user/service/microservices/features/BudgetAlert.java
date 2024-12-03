package com.finance.user.service.microservices.features;

import com.finance.user.dto.features.BudgetAlertDto;

import java.util.List;

public interface BudgetAlert {
    public List<BudgetAlertDto> getBudgetAlerts(int userId);
}
