package com.finance.expense.api;

import com.finance.expense.dto.ExpenseDto;
import com.finance.expense.model.ExpenseModel;
import com.finance.expense.repository.ExpenseRepository;
import com.finance.expense.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expense")
public class ExpenseApiController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @PostMapping
    public ResponseEntity<ExpenseModel> saveExpense(@RequestBody ExpenseModel expense) {
        ExpenseModel createdExpense = expenseService.save(expense);
        if (createdExpense != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense); // 201
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // 409
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ExpenseModel>> getAllExpenses(@PathVariable("userId") int userId) {
        List<ExpenseModel> list = expenseService.getAllexpenses(userId);
//        if (!list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(list); // 200
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404
//        }
    }

    @PutMapping("/{userId}/category")
    public ResponseEntity<ExpenseModel> updateExpense(@PathVariable("userId") int userId, @RequestParam("name") String category, @RequestBody ExpenseModel expense) {
        ExpenseModel updatedIncome = expenseService.updateBySource(userId, category, expense);
        if (updatedIncome != null) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(updatedIncome); // 202
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteExpenseById(@PathVariable("id") int id) {
        expenseService.deleteExpenseById(id);
    }

    @GetMapping("/analysis/{userId}/{startDate}/{endDate}")
    public ResponseEntity<List<ExpenseDto>> getExpensesByCategoryAndPeriod(
            @PathVariable int userId,
            @PathVariable("startDate") LocalDate startDate,
            @PathVariable("endDate") LocalDate endDate) {

        List<ExpenseDto> expenses = expenseRepository.findTotalExpensesByCategoryAndPeriod(userId, startDate, endDate);
        return ResponseEntity.status(HttpStatus.OK).body(expenses);
    }
//    @GetMapping("/analysis/{userId}/{startDate}/{endDate}")
//    public ResponseEntity<List<ExpenseDto>> getExpensesByCategoryAndPeriod(
//            @PathVariable int userId,
//            @PathVariable("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
//            @PathVariable("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
//        List<ExpenseDto> expenses = expenseRepository.findTotalExpensesByCategoryAndPeriod(userId, startDate, endDate);
//        return ResponseEntity.status(HttpStatus.OK).body(expenses);
//    }

}
