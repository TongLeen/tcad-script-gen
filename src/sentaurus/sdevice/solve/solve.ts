import useFormatUtils from "../format-utils";
import { formatSingle, type SingleType } from "./single";
import {
    type DeviceGoalType,
    type StepType,
    type PlotType,
    formatPlot,
    formatGoal,
} from "./control";

type QuasistationaryType = StepType & {
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
        const { formatAssignment } = useFormatUtils(params);
        formatAssignment(e, "InitialStep");
        formatAssignment(e, "MinStep");
        formatAssignment(e, "MaxStep");
        formatAssignment(e, "Increment");
        formatAssignment(e, "Decrement");
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
    const transient = () => {};
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
