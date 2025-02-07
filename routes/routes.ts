import { Router } from "npm:express@4.18.2";
import {
  getActivities, 
  getPlans,
  linkActivity, 
  trainingHistory,
  signUp
} from "../controllers/controller.ts";

const router = Router();

router.route("/activities/:userId").get(getActivities);
router.route("/plans").get(getPlans);
router.route("/link").post(linkActivity);
router.route("/training").get(trainingHistory);
router.route("/sign-up").post(signUp);

export default router;
