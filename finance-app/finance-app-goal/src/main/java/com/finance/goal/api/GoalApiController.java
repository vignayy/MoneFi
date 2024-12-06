package com.finance.goal.api;

import com.finance.goal.model.GoalModel;
import com.finance.goal.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goal")
public class GoalApiController {

    @Autowired
    private GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalModel> saveGoal(@RequestBody GoalModel goal) {
        GoalModel createdGoal = goalService.save(goal);
        if (createdGoal != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGoal); // 201
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // 409
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<GoalModel>> getAllGoals(@PathVariable("userId") int userId) {
        List<GoalModel> list = goalService.getAllGoals(userId);
//        if (!list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(list); // 200
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404
//        }
    }

    @PutMapping("/{userId}/goalName")
    public ResponseEntity<GoalModel> updateGoal(@PathVariable("userId") int userId, @RequestParam("name") String goalName, @RequestBody GoalModel goal) {
        GoalModel updatedGoal = goalService.updateByGoalName(userId, goalName, goal);
        if (updatedGoal != null) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(updatedGoal); // 202
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable("id") int id) {
        goalService.deleteGoalById(id);
    }
}
