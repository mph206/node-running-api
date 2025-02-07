import { TrainingEntry } from "../domain/Training.d.ts";
import { trainingCollection } from "./Database.ts";

export const createTrainingEntry = async (entry: TrainingEntry) => {
    const foundEntry = await trainingCollection.findOne({ 
        userId: entry.userId,
        planId: entry.planId,
        weekId: entry.weekId,
        day: entry.day
    });

    if (foundEntry) {
        throw new Error("Training entry already exists for this day");
    }

    await trainingCollection.insertOne(entry);
};

export const getTrainingHistory = (userId: string, planId: string): Promise<TrainingEntry[]> => {
    return trainingCollection.find<TrainingEntry>({
        userId: userId,
        planId: planId,
    }).toArray();
};
