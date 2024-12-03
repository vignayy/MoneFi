package com.finance.goal.service;

import com.finance.goal.model.GoalModel;

import java.util.List;

public interface GoalService {

    public GoalModel save(GoalModel goal);

    public List<GoalModel> getAllGoals(int userId);

    public GoalModel updateByGoalName(int userId, String goalName, GoalModel goal);

    public void deleteParticularGoalByGoalName(int userId, String goalName);
}
