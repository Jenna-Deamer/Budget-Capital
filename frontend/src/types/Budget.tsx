export interface Budget {
    _id: string;
    targetAmount: number;
    actualAmount: number;
    month: string;
    year: number;
}

export interface BudgetFormData {
    _id: string;
    amount: string;
    month: string;
    year: string;
}
