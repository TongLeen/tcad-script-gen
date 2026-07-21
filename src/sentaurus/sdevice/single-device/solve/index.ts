import {
    type Computation,
    formatComputation,
} from "../../mode-independent/solve/commands/Computation";
import {
    type PlotType,
    formatPlot,
} from "../../mode-independent/solve/commands/Plot";

import { type TransientType, formatTransient } from "./transient";
import {
    type QuasistationaryType,
    formatQuasistationary,
} from "./quasistationary";

const solveGenerator = () => {
    const buffer: string[] = [];

    const single = (e: Computation) => {
        buffer.push(...formatComputation(e));
    };

    const quasistationary = <M extends string>(e: QuasistationaryType<M>) =>
        buffer.push(...formatQuasistationary(e));

    const transient = (e: TransientType) => buffer.push(...formatTransient(e));

    const newCurrentPrefix = (prefix: string) => {
        buffer.push(`NewCurrentPrefix="${prefix}"`);
    };
    const load = (l: PlotType) => {
        buffer.push("Load", "(", ...formatPlot(l), ")");
    };
    const save = (s: PlotType) => {
        buffer.push("Save", "(", ...formatPlot(s), ")");
    };
    const generate = () => {
        return ["Solve", "{", ...buffer, "}"];
    };
    const setContact = (
        Name: string,
        mode: "Voltage" | "Current" | "Charge",
    ) => {
        buffer.push(`Set("${Name}" mode ${mode})`);
    };
    return [
        {
            single,
            quasistationary,
            transient,
            newCurrentPrefix,
            load,
            save,
            setContact,
        },
        generate,
    ] as const;
};

export { solveGenerator };
