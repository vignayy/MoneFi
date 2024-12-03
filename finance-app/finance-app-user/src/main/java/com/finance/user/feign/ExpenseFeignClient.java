package com.finance.user.feign;


import com.finance.user.dto.ExpenseModel;
import com.finance.user.dto.features.ExpenseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@FeignClient("FINANCE-APP-EXPENSE")
public interface ExpenseFeignClient {

    @PostMapping("/api/expense")
    public ResponseEntity<ExpenseModel> saveExpense(@RequestBody ExpenseModel expense);

    @GetMapping("/api/expense/{userId}")
    public ResponseEntity<List<ExpenseModel>> getAllExpenses(@PathVariable("userId") int userId);

    @PutMapping("/api/expense/{userId}/category")
    public ResponseEntity<ExpenseModel> updateExpense(@PathVariable("userId") int userId, @RequestParam("name") String category, @RequestBody ExpenseModel expense);

    @DeleteMapping("/api/expense/{userId}/category")
    public void deleteExpenseByCategory(@PathVariable("userId") int userId, @RequestParam("name") String category);

    @GetMapping("/api/expense/analysis/{userId}/{startDate}/{endDate}")
    ResponseEntity<List<ExpenseDto>> getExpensesByCategoryAndPeriod(
            @PathVariable int userId,
            @PathVariable("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @PathVariable("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    );
}
