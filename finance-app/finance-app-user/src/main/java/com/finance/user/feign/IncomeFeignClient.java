package com.finance.user.feign;


import com.finance.user.dto.IncomeModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient("FINANCE-APP-INCOME")
public interface IncomeFeignClient {

    @PostMapping("api/income")
    public ResponseEntity<IncomeModel> saveIncome(@RequestBody IncomeModel income);

    @GetMapping("api/income/{userId}")
    public ResponseEntity<List<IncomeModel>> getAllIncomes(@PathVariable("userId") int userId);

    @PutMapping("api/income/{id}")
    public IncomeModel updateIncome(@PathVariable("id") int id, @RequestBody IncomeModel income);

    @DeleteMapping("api/income/{id}")
    public void deleteIncomeById(@PathVariable("id") int id);
}
