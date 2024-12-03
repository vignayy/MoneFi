package com.finance.user.feign;


import com.finance.user.dto.GoalModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@FeignClient("FINANCE-APP-GOAL")
public interface GoalFeignClient {

    @PostMapping("/api/goal")
    public ResponseEntity<GoalModel> saveGoal(@RequestBody GoalModel goal);


    @GetMapping("/api/goal/{userId}")
    public ResponseEntity<List<GoalModel>> getAllGoals(@PathVariable("userId") int userId);


    @PutMapping("/api/goal/{userId}/goalName")
    public ResponseEntity<GoalModel> updateGoal(@PathVariable("userId") int userId, @RequestParam("name") String goalName, @RequestBody GoalModel goal);


    @DeleteMapping("/api/goal/{userId}/goalName")
    public void deleteByGoalName(@PathVariable("userId") int userId, @RequestParam("name") String goalName);

}
