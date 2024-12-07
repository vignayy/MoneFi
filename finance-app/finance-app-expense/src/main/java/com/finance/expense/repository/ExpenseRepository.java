package com.finance.expense.repository;


import com.finance.expense.dto.ExpenseDto;
import com.finance.expense.model.ExpenseModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<ExpenseModel, Integer> {

    public ExpenseModel findByUserId(int userId);

    public ExpenseModel findByCategory(String category);

    @Query("select e from ExpenseModel e where e.userId = :userId")
    public List<ExpenseModel> findExpensesByUserId(int userId);

    @Query("select e from ExpenseModel e where e.userId=:userId and e.category=:category")
    public ExpenseModel findByUserIdAndCatergory(int userId, String category);

    @Query("SELECT e FROM ExpenseModel e WHERE e.userId = :userId " +
            "AND EXTRACT(MONTH FROM e.date) = :month " +
            "AND EXTRACT(YEAR FROM e.date) = :year")
    public List<ExpenseModel> getAllexpensesByDate(int userId, int month, int year);

    @Query("SELECT new com.finance.expense.dto.ExpenseDto(e.category, SUM(e.amount)) " +
            "FROM ExpenseModel e " +
            "WHERE e.userId = :userId AND e.date BETWEEN :startDate AND :endDate " +
            "GROUP BY e.category")
    List<ExpenseDto> findTotalExpensesByCategoryAndPeriod(@Param("userId") int userId,
                                                          @Param("startDate") LocalDate startDate,
                                                          @Param("endDate") LocalDate endDate);




}
