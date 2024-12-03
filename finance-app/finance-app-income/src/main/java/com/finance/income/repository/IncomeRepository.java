package com.finance.income.repository;

import com.finance.income.model.IncomeModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IncomeRepository extends JpaRepository<IncomeModel, Integer> {

    @Query("select i from IncomeModel i where i.userId = :userId")
    public List<IncomeModel> findIncomesOfUser(int userId);

    @Query("select i from IncomeModel i where i.userId=:userId and i.source=:source")
    public IncomeModel findByUserIdAndSource(int userId, String source);

    @Transactional
    @Modifying
    @Query("Delete from IncomeModel i where i.userId=:userId and i.source=:source")
    public void deleteParticularIncomeBySource(int userId, String source);

}
