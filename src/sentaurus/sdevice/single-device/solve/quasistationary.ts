import SDeviceFormat from "../../utils/format";

import type { StepType } from "../../mode-independent/solve/control/step";
import {
    type PlotType,
    formatPlot,
} from "../../mode-independent/solve/commands/Plot";
import {
    type Computation,
    formatComputation,
} from "../../mode-independent/solve/commands/Computation";

import {
    type QuasistationaryGoal,
    formatQuasistationaryGoal,
} from "./control/goal";
import {
    type BreakCriteria,
    formatBreakCriteria,
} from "./control/breakcriteria";

type QuasistationaryType<M extends string> = StepType & {
    Goal: QuasistationaryGoal<M> | QuasistationaryGoal<M>[];
    BreakCriteria?: BreakCriteria | BreakCriteria[];
    Plot?: PlotType;
    computation: Computation;
};

const formatQuasistationary = <M extends string>(e: QuasistationaryType<M>) => {
    const params = SDeviceFormat(e)({
        assign: ["InitialStep", "MinStep", "MaxStep", "Increment", "Decrement"],
        others: {
            Goal: (_, v) => {
                if (Array.isArray(v)) {
                    return v
                        .map(formatQuasistationaryGoal)
                        .map((v) => ["Goal", "{", ...v, "}"])
                        .flat();
                }
                return ["Goal", "{", ...formatQuasistationaryGoal(v), "}"];
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
    return ["Quasistationary", "(", ...params, ")", "{", ...cmds, "}"];
};

export { formatQuasistationary };
export type { QuasistationaryType };
