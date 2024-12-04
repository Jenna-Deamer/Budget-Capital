export interface Budget {
    _id: string;
    targetAmount: number;
    actualAmount: number;
    month: string;
    year: number;
}


export interface BudgetFormData {

    amount: string;

    month: string;

    year: string;

    id: string;

}