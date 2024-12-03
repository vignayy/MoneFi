package com.finance.user.service.microservices.features;

import com.finance.user.dto.features.SpendingPatternDto;

import java.util.List;

public interface SpendingAnalysisService {

    List<SpendingPatternDto> analyzeSpendingPattern(int userId);
}
