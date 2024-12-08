package com.finance.user.api;

import com.finance.user.dto.BudgetModel;
import com.finance.user.dto.ExpenseModel;
import com.finance.user.dto.GoalModel;
import com.finance.user.dto.IncomeModel;
import com.finance.user.dto.features.BudgetAlertDto;
import com.finance.user.dto.features.MonthlyAndYearlySummaryDto;
import com.finance.user.dto.features.SpendingPatternDto;
import com.finance.user.model.ProfileModel;
import com.finance.user.model.UserModel;
import com.finance.user.repository.ProfileRepository;
import com.finance.user.repository.UserRepository;
import com.finance.user.service.UserService;
import com.finance.user.service.microservices.expense.UserExpenseService;
import com.finance.user.service.microservices.features.BudgetAlert;
import com.finance.user.service.microservices.features.MonthlyAndYearlySummary;
import com.finance.user.service.microservices.features.SpendingAnalysisService;
import com.finance.user.service.microservices.goal.UserGoalService;
import com.finance.user.service.microservices.income.UserIncomeService;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserIncomeService incomeService;

    @Autowired
    private UserExpenseService expenseService;

    @Autowired
    private UserGoalService goalService;

    @Autowired
    private MonthlyAndYearlySummary monthlyAndYearlySummary;

    @Autowired
    private BudgetAlert budgetAlert;

    @Autowired
    private SpendingAnalysisService spendingAnalysisService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ProfileRepository profileRepository;

    //api call to check api gateway
    @GetMapping("/hello")
    public String hello(HttpServletRequest request)
    {
        return "Hello World Page " + request.getSession().getId();
    }

    //call from api gateway to save the user details
    @PostMapping("/setDetails/{userId}/{name}/{email}")
    public UserModel setUserDetails(@PathVariable("userId") int userId, @PathVariable("name") String name, @PathVariable("email") String email){
        UserModel userModel = new UserModel();

        userModel.setUserId(userId);
        userModel.setName(name);
        userModel.setEmail(email);

        ProfileModel profile = new ProfileModel();
        profile.setUserId(userId);
        profile.setName(name);
        profile.setEmail(email);
        ProfileModel addedProfile = profileRepository.save(profile);

        return userRepository.save(userModel);
    }
//    @GetMapping("/getUserId/{email}")
//    public ResponseEntity<Integer> getUserIdByEmail(@PathVariable("email") String email){
//        return ResponseEntity.status(HttpStatus.OK).body(userService.getUserIdFromEmail(email));
//    }
    @GetMapping("/getName/{userId}")
    public String getNameFromUserId(@PathVariable("userId") int userId){
        return userService.getNameFromUserId(userId);
    }
    @PostMapping
    public ResponseEntity<UserModel> save(@RequestBody UserModel user) {
        UserModel user2 = userService.save(user);
        if (user2 != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(user2);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

//    @GetMapping
//    public ResponseEntity<List<UserModel>> getAllUsers(){
//        List<UserModel> usersList = userService.getAllUsers();
//        if(!usersList.isEmpty()){
//            return ResponseEntity.status(HttpStatus.OK).body(usersList);
//        }
//        else{
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
//    }

//    @GetMapping("/username")
//    public ResponseEntity<UserModel> getUserByEmail(@RequestParam("name") String username){
//        UserModel user = userService.getUserByUsername(username);
//        if(user != null){
//            return ResponseEntity.status(HttpStatus.OK).body(user);
//        }
//        else{
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
//    }

//    @PutMapping("/{username}/{password}")
//    public ResponseEntity<UserModel> update(@PathVariable("username") String username, @PathVariable("password") String password) {
//        UserModel updatedUser = userService.updateUser(username, password);
//        if (updatedUser != null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(updatedUser);
//        } else {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
//        }
//    }

    @DeleteMapping("/{userId}")
    public ResponseEntity deleteUser(@PathVariable("userId") int userId){
        userService.deleteUserById(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }






    // Income Api calls
    @PostMapping("/{userId}/income")
    public ResponseEntity<IncomeModel> addIncome(@PathVariable int userId, @RequestBody IncomeModel income) {
        IncomeModel createdIncome = incomeService.addIncome(userId, income);
        if(createdIncome!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(createdIncome);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    @GetMapping("/{userId}/incomes")
    public ResponseEntity<List<IncomeModel>> getAllIncomes(@PathVariable("userId") int userId) {
        List<IncomeModel> incomesList = incomeService.getAllIncomes(userId);
        return ResponseEntity.ok(incomesList);
    }
    @GetMapping("/{userId}/totalIncome")
    public Integer getTotalIncome(@PathVariable("userId") int userId){
        List<IncomeModel> incomesList = incomeService.getAllIncomes(userId);
        return (int) incomesList.stream().mapToDouble(i->i.getAmount()).sum();
    }
    @GetMapping("/incomes/{userId}/{month}/{year}")
    public ResponseEntity<List<IncomeModel>> getAllIncomesByDate(@PathVariable("userId") int userId,
                                                                   @PathVariable("month") int month,
                                                                   @PathVariable("year") int year) {
        List<IncomeModel> incomesList = incomeService.getAllIncomesByDate(userId, month, year);
        return ResponseEntity.ok(incomesList);
    }
    @GetMapping("/incomes/{userId}/{year}")
    public ResponseEntity<List<IncomeModel>> getAllIncomesByYear(@PathVariable("userId") int userId,
                                                                   @PathVariable("year") int year) {
        List<IncomeModel> incomesList = incomeService.getAllIncomesByYear(userId, year);
        return ResponseEntity.ok(incomesList);

    }
    @PutMapping("/{id}/income")
    public ResponseEntity<IncomeModel> updateIncome(@PathVariable("id") int id, @RequestBody IncomeModel income){
        IncomeModel updatedIncome = incomeService.updateIncome(id, income);
        if(updatedIncome!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedIncome);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    @DeleteMapping("/{id}/income")
    public ResponseEntity<Void> deleteIncomeById(@PathVariable("id") int id) {
        boolean isDeleted = incomeService.deleteIncomeById(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204: No Content
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404: Not Found
        }
    }




    // Expense Api calls
    @PostMapping("/{userId}/expense")
    public ResponseEntity<ExpenseModel> addExpense(@PathVariable int userId, @RequestBody ExpenseModel expense) {
        ExpenseModel createdExpense = expenseService.addExpense(userId, expense);
        if(createdExpense!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(createdExpense);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    @GetMapping("/{userId}/expenses")
    public ResponseEntity<List<ExpenseModel>> getAllExpenses(@PathVariable("userId") int userId) {
        List<ExpenseModel> expensesList = expenseService.getAllExpenses(userId);
        return ResponseEntity.ok(expensesList);
    }
    @GetMapping("/expenses/{userId}/{month}/{year}")
    public ResponseEntity<List<ExpenseModel>> getAllExpensesByDate(@PathVariable("userId") int userId,
                                                                   @PathVariable("month") int month,
                                                                   @PathVariable("year") int year) {
        List<ExpenseModel> expensesList = expenseService.getAllExpensesByDate(userId, month, year);
        return ResponseEntity.ok(expensesList);
    }
    @GetMapping("/expenses/{userId}/{year}")
    public ResponseEntity<List<ExpenseModel>> getAllExpensesByYear(@PathVariable("userId") int userId,
                                                                   @PathVariable("year") int year) {
        List<ExpenseModel> expensesList = expenseService.getAllExpensesByYear(userId, year);
        return ResponseEntity.ok(expensesList);
    }
    @GetMapping("/{userId}/totalExpense")
    public Integer getTotalExpense(@PathVariable("userId") int userId){
        List<ExpenseModel> expensesList = expenseService.getAllExpenses(userId);
        return (int) expensesList.stream().mapToDouble(i->i.getAmount()).sum();
    }
    @PutMapping("/{id}/expense")
    public ResponseEntity<ExpenseModel> updateExpense(@PathVariable("id") int id, @RequestBody ExpenseModel expense){
        ExpenseModel updatedExpense = expenseService.updateExpense(id, expense);
        if(updatedExpense!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedExpense);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    @DeleteMapping("/{id}/expense")
    public ResponseEntity<Void> deleteExpenseById(@PathVariable("id") int id) {
        boolean isDeleted = expenseService.deleteExpenseById(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204: No Content
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404: Not Found
        }
    }




    // Budget calls
    @PostMapping("/{userId}/budget")
    public ResponseEntity<BudgetModel> addBudget(@PathVariable int userId, @RequestBody BudgetModel budget) {
        budget.setUserId(userId);
        BudgetModel createdBudget = restTemplate.postForObject("http://FINANCE-APP-BUDGET/api/budget", budget, BudgetModel.class);
        if(createdBudget!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    @GetMapping("/{userId}/budgets")
    public ResponseEntity<List<BudgetModel>> getAllBudgets(@PathVariable("userId") int userId) {
        BudgetModel[] list = restTemplate.getForObject("http://FINANCE-APP-BUDGET/api/budget/" + userId, BudgetModel[].class);
        List<BudgetModel> budgetList = new ArrayList<>(Arrays.asList(list));
        if (!budgetList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(budgetList);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }





    // Goal Api calls
    @PostMapping("/{userId}/goal")
    public ResponseEntity<GoalModel> addGoal(@PathVariable int userId, @RequestBody GoalModel goal) {
        GoalModel createdGoal = goalService.addGoal(userId, goal);
        if(createdGoal!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGoal);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    @GetMapping("/{userId}/goals")
    public ResponseEntity<List<GoalModel>> getAllGoals(@PathVariable("userId") int userId) {
        List<GoalModel> goalsList = goalService.getAllGoals(userId);
        return ResponseEntity.ok(goalsList);
    }
    @GetMapping("/{userId}/totalCurrentGoalIncome")
    public Integer getCurrentTotalGoalIncome(@PathVariable("userId") int userId){
        List<GoalModel> goalsList = goalService.getAllGoals(userId);
        return (int) goalsList.stream().mapToDouble(i->i.getCurrentAmount()).sum();
    }
    @GetMapping("/{userId}/totalTargetGoalIncome")
    public Integer getTargetTotalGoalIncome(@PathVariable("userId") int userId){
        List<GoalModel> goalsList = goalService.getAllGoals(userId);
        return (int) goalsList.stream().mapToDouble(i->i.getTargetAmount()).sum();
    }
    @PutMapping("/{id}/goal")
    public ResponseEntity<GoalModel> updateGoal(@PathVariable("id") int id, @RequestBody GoalModel goal){
        GoalModel updatedGoalList = goalService.updateGoal(id, goal);
        if(updatedGoalList!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedGoalList);
        }
        else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
    @DeleteMapping("/{id}/goal")
    public ResponseEntity<Void> deleteGoalById(@PathVariable("id") int id) {
        boolean isDeleted = goalService.deleteGoalById(id);
        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204: No Content
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404: Not Found
        }
    }



    // Monthly and Yearly summary api controllers
    @GetMapping("/summary/monthly/{userId}/{month}/{year}")
    public ResponseEntity<MonthlyAndYearlySummaryDto> getMonthlyInsights(@PathVariable("userId") int userId, @PathVariable("month") int month, @PathVariable("year") int year) {
        MonthlyAndYearlySummaryDto monthlySummaryDto = monthlyAndYearlySummary.getMonthlySummary(userId, month, year);
        if (monthlySummaryDto != null) {
            return ResponseEntity.status(HttpStatus.OK).body(monthlySummaryDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/summary/yearly/{id}/{year}")
    public ResponseEntity<MonthlyAndYearlySummaryDto> getYearlyInsights(@PathVariable("id") int id, @PathVariable("year") int year) {
        MonthlyAndYearlySummaryDto yearlySummaryDto = monthlyAndYearlySummary.getYearlySummary(id, year);
        if (yearlySummaryDto != null) {
            return ResponseEntity.status(HttpStatus.OK).body(yearlySummaryDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    // budget alert api
    @GetMapping("/alert/{userId}")
    public ResponseEntity<List<BudgetAlertDto>> getBudgetAlerts(@PathVariable("userId") int userId) {
        List<BudgetAlertDto> list = budgetAlert.getBudgetAlerts(userId);
        if (!list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(list);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    // Spending Analysis
    @GetMapping("/analysis/{userId}")
    public ResponseEntity<List<SpendingPatternDto>> getSpendingPattern(@PathVariable int userId) {
        List<SpendingPatternDto> insights = spendingAnalysisService.analyzeSpendingPattern(userId);
        if (!insights.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(insights);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



    // frontend overview component calls
    @GetMapping("/{userId}/budgetProgres")
    public Double budgetProgress(@PathVariable("userId") int userId){
        BudgetModel[] list = restTemplate.getForObject("http://FINANCE-APP-BUDGET/api/budget/"+userId, BudgetModel[].class);
        List<BudgetModel> budgetsList = new ArrayList<>(Arrays.asList(list));
        double currentSpending = budgetsList.stream().mapToDouble(i->i.getCurrentSpending()).sum();
        double moneyLimit = budgetsList.stream().mapToDouble(i->i.getMoneyLimit()).sum();
        return currentSpending/moneyLimit;
    }


    // profile component api call
    @PostMapping("/profile/{userId}")
    public ProfileModel saveProfile(@PathVariable("userId") int userId, @RequestBody ProfileModel profile){
        profile.setUserId(userId);
        ProfileModel fetchProfile = profileRepository.findByUserId(userId);
        fetchProfile.setName(profile.getName());
        fetchProfile.setEmail(profile.getEmail());
        fetchProfile.setPhone(profile.getPhone());
        fetchProfile.setAddress(profile.getAddress());
        fetchProfile.setIncomeRange(profile.getIncomeRange());
        fetchProfile.setProfileImage(profile.getProfileImage());

        return profileRepository.save(fetchProfile);
    }
    @GetMapping("/profile/{userId}")
    public ProfileModel getProfile(@PathVariable("userId") int userId){
        return profileRepository.findByUserId(userId);
    }

}




