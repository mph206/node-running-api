// @deno-types="npm:@types/express@4.17.15"
import { Request, Response } from "npm:express@4.18.2";
import { User } from "../domain/User.d.ts";
import { createUser } from "../persistence/Users.ts";
import { StravaClient } from "../clients/stravaClient.ts";
import planData from "../plans/plans.json" with { type: "json" };
import { createTrainingEntry, getTrainingHistory } from "../persistence/Training.ts";
import { StravaAthlete } from "../plans/plan.ts";

export async function getActivities(req: Request, res: Response): Promise<void> {
  try {
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
    res.send(planData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
    console.log(error)
  }
}

export async function linkActivity(req: Request, res: Response): Promise<void> {
  try {
    const { planId, stravaActivityId, weekId, userId, day } = req.body;

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

export async function trainingHistory(req: Request, res: Response): Promise<void> {
  try {
    const params = req.query as { userId: string, planId: string };
    console.log(params )
    const training = await getTrainingHistory(params.userId, params.planId)
    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({ error: "Failed" });
    console.log(error)
  }
}

export async function signUp(req: Request, res: Response): Promise<void>{
  try {
    const userId: string = req.body.userId;
    const stravaToken = Deno.env.get("STRAVA_ACCESS_TOKEN") as string;
    const client = new StravaClient(stravaToken);
    const athlete: StravaAthlete  = await client.getAthlete(userId)
    const user: User = {
      id: userId,
      givenName: athlete.firstname,
      familyName:  athlete.lastname,
      sex: athlete.sex as "M" | "F"
    }

    await createUser(user)
    res.status(200).json({ status: "ok" });

  } catch (error) {
    res.status(500).json({ error: "Failed" });
    console.log(error)
  }
}
