import type { TransientTime } from "../../mode-independent/solve/control/transienttime";
import type { StepType } from "../../mode-independent/solve/control/step";
import {
    type Computation,
    formatComputation,
} from "../../mode-independent/solve/commands/Computation";
import {
    type PlotType,
    formatPlot,
} from "../../mode-independent/solve/commands/Plot";

import type { AcceptNewtonParameter } from "./control/acceptnewtonparameter";
import {
    type BreakCriteria,
    formatBreakCriteria,
} from "./control/breakcriteria";
import { formatTransientGoal, type TransientGoal } from "./control/goal";
import SDeviceFormat from "../../utils/format";

type TransientType = TransientTime &
    StepType & {
        Transient?: "BE" | "TRBDF";
        InitialTime?: number;
        FinalTime?: number;
    } & {
        AcceptNewtonParameter?: AcceptNewtonParameter;
        BreakCriteria?: BreakCriteria | BreakCriteria[];
        Goal: TransientGoal | TransientGoal[];
        Plot?: PlotType;
        computation: Computation;
    };

const formatTransient = (e: TransientType) => {
    const params = SDeviceFormat(e)({
        assign: [
            "InitialStep",
            "MinStep",
            "MaxStep",
            "Increment",
            "Decrement",
            "Transient",
            "InitialTime",
            "FinalTime",
        ],
        others: {
            Goal: (_, v) => {
                if (Array.isArray(v)) {
                    return v
                        .map(formatTransientGoal)
                        .map((v) => ["Goal", "{", ...v, "}"])
                        .flat();
                }
                return ["Goal", "{", ...formatTransientGoal(v), "}"];
            },
            BreakCriteria: (_, v) => {
                if (Array.isArray(v)) {
                    return v
                        .map(formatBreakCriteria)
                        .map((v) => ["BreakCriteria", "{", ...v, "}"])
                        .flat();
                }
                return ["BreakCriteria", "{", ...formatBreakCriteria(v), "}"];
            },
        },
    });
    const cmds = SDeviceFormat(e)({
        block: {
            Plot: (v) => ["Plot", "{", ...formatPlot(v), "}"],
        },
        others: {
            computation: (_, v) => formatComputation(v),
        },
    });
    return ["Transient", "(", ...params, ")", "{", ...cmds, "}"];
};

export { formatTransient };
export type { TransientType };
