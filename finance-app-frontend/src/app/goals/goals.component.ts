import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Goal {
  id: number;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  category: string;
  icon: string;
  color: string;
  milestones?: { amount: number; achieved: boolean }[];
}

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GoalsComponent {
  goals: Goal[] = [];
  loading: boolean = false;
  selectedGoal: Goal | null = null;

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    this.loading = true;
    // Simulated data - replace with actual API call
    this.goals = [
      {
        id: 1,
        goalName: 'Dream Vacation',
        currentAmount: 3000,
        targetAmount: 5000,
        deadline: '2024-12-31',
        category: 'Travel',
        icon: 'fa-plane',
        color: '#2196F3',
        milestones: [
          { amount: 1000, achieved: true },
          { amount: 2500, achieved: true },
          { amount: 4000, achieved: false }
        ]
      },
      {
        id: 2,
        goalName: 'Emergency Fund',
        currentAmount: 8000,
        targetAmount: 10000,
        deadline: '2024-09-30',
        category: 'Savings',
        icon: 'fa-shield-alt',
        color: '#4CAF50',
        milestones: [
          { amount: 2500, achieved: true },
          { amount: 5000, achieved: true },
          { amount: 7500, achieved: true }
        ]
      },
      {
        id: 3,
        goalName: 'New Car',
        currentAmount: 15000,
        targetAmount: 30000,
        deadline: '2025-06-30',
        category: 'Vehicle',
        icon: 'fa-car',
        color: '#FF9800',
        milestones: [
          { amount: 10000, achieved: true },
          { amount: 20000, achieved: false },
          { amount: 25000, achieved: false }
        ]
      }
    ];
    this.loading = false;
  }

  getProgressPercentage(current: number, target: number): number {
    return (current / target) * 100;
  }

  getDaysRemaining(deadline: string): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getProgressColor(current: number, target: number): string {
    const percentage = this.getProgressPercentage(current, target);
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 50) return '#2196f3';
    return '#ff9800';
  }

  addGoal() {
    // Implement add goal logic
    console.log('Add goal clicked');
  }

  viewGoalDetails(goal: Goal) {
    this.selectedGoal = goal;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  calculateMonthlyTarget(goal: Goal): number {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 + 
                          (deadline.getMonth() - today.getMonth());
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    return remainingAmount / monthsRemaining;
  }
}