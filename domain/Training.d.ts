export type TrainingEntry = {
    userId: string;
    planId: string;
    weekId: string;
    day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    activityId: string;
}