// @deno-types="npm:@types/express@4.17.15"
import { Request, Response } from "npm:express@4.18.2";
import { User } from "../domain/User.d.ts";
import { createUser } from "../persistence/Users.ts";
import { StravaClient } from "../clients/stravaClient.ts";
import planData from "../plans/plans.json" with { type: "json" };
import { createTrainingEntry, getTrainingHistory } from "../persistence/Training.ts";

export async function getActivities(req: Request, res: Response): Promise<void> {
  try {
    // const stravaToken = req.headers['x-strava-token'] as string;
    const stravaToken = Deno.env.get("STRAVA_ACCESS_TOKEN") as string;

    if (!stravaToken) {
      res.status(401).json({ error: "Strava token required" });
      return;
    }

    const client = new StravaClient(stravaToken);

    const activities = await client.getActivities();
    res.json(activities);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
}

export async function getPlans(req: Request, res: Response) {
  try {
    // Fetch available training plans
    res.send(planData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
    console.log(error)
  }
}

// TODO
export async function linkActivity(req: Request, res: Response): Promise<void> {
  try {
    const { planId, runId } = req.params;
    const { stravaActivityId, weekId, userId, day } = req.body;

    if (!stravaActivityId || !weekId || !userId || !day) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    await createTrainingEntry({
      userId,
      planId,
      weekId,
      day: day as 1 | 2 | 3 | 4 | 5 | 6 | 7,
      activityId: stravaActivityId
    });

    res.json({
      message: "Activity linked successfully",
      data: {
        userId,
        planId,
        weekId,
        day,
        activityId: stravaActivityId
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      if (error.message.includes("already exists")) {
        res.status(409).json({ error: "Training entry already exists for this day" });
      } else {
        res.status(500).json({ error: "Failed to link activity" });
      }
    }
    
  }
}

export function trainingHistory(req: Request, res: Response): void{
  try {
    const {userId, planId}: { userId: string, planId: string } = req.body;
    getTrainingHistory(userId, planId)
  } catch (error) {
    res.status(500).json({ error: "Failed" });
    console.log(error)
  }
}

export async function signUp(req: Request, res: Response): Promise<void>{
  try {
    const userId: string = req.body.userId;
    // TODO get user from API
    const user: User = { id: "12345", givenName: "Tester", familyName: "Joe", sex: "M"}
    await createUser(user)
  } catch (error) {
    res.status(500).json({ error: "Failed" });
    console.log(error)
  }
}
