import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import musicRouter from "./music";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(musicRouter);

export default router;
