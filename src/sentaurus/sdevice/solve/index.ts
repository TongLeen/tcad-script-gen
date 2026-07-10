import useFormatUtils from "../format-utils";
import { formatSingle, type SingleType } from "./commands/Compute";
import { formatPlot, type PlotType } from "./commands/Plot";
import {
    type DeviceGoalType,
    type StepType,
    type AcceptNewtonParameter,
    type BreakCriteria,
    type TransientTime,
    formatStep,
    formatGoal,
} from "./control";

type QuasistationaryType = StepType & {
    goal: DeviceGoalType | DeviceGoalType[];
    plot: PlotType;
    equation: SingleType;
};

type TransientType = TransientTime &
    StepType & {
        Transient?: "BE" | "TRBDF";
        InitialTime?: number;
        FinalTime?: number;
    } & {
        AcceptNewtonParameter?: AcceptNewtonParameter;
        BreakCriteria?: BreakCriteria;
        goal: DeviceGoalType | DeviceGoalType[];
        plot: PlotType;
        equation: SingleType;
    };

const solveGenerator = () => {
    const buffer: string[] = [];

    const single = (e: SingleType) => {
        buffer.push(...formatSingle(e));
    };

    const quasistationary = (e: QuasistationaryType) => {
        const params: string[] = [];
        params.push(...formatStep(e));
        if (Array.isArray(e.goal)) {
            params.push(...e.goal.map(formatGoal).flat());
        } else {
            params.push(...formatGoal(e.goal));
        }
        return [
            "Quasistationary",
            "(",
            ...params,
            ")",
            "{",
            ...formatSingle(e.equation),
            ...formatPlot(e.plot),
            "}",
        ];
    };
    const transient = (e: TransientType) => {
        const params: string[] = [];
        const { formatAssignment } = useFormatUtils(params);
        params.push(...formatStep(e));
        if (Array.isArray(e.goal)) {
            params.push(...e.goal.map(formatGoal).flat());
        } else {
            params.push(...formatGoal(e.goal));
        }
        formatAssignment(e, "Transient");
        formatAssignment(e, "InitialTime");
        formatAssignment(e, "FinalTime");
        return [
            "Transient",
            "(",
            ...params,
            ")",
            "{",
            ...formatSingle(e.equation),
            ...formatPlot(e.plot),
            "}",
        ];
    };
    const generate = () => {
        return ["Solve", "{", ...buffer, "}"];
    };
    return [
        {
            single,
            quasistationary,
            transient,
        },
        generate,
    ] as const;
};

export { solveGenerator };
