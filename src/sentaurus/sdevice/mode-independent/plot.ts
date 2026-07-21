import type { PlotVariable } from "../definations";

type PlotType = PlotVariable[];

const plotGenerator = (ctx: string[]) => {
    return (p: PlotType) => {
        ctx.push("Plot", "{", ...p, "}");
    };
};

export { plotGenerator };
export type { PlotType };
