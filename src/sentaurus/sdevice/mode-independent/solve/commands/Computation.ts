import { formatMethod, type Method } from "../../../misc/linearsolver";
import type { Equation } from "../../../definations";

import SDeviceFormat from "../../../utils/format";

type CoupledType = {
    kind: "Coupled";
    equations: Equation | Equation[];
    CheckBehavior?: "CheckRhsAfterUpdate" | "RhsAndUpdateConvergence";
    Digits?: number;
    IncompleteNewton?: true | { RHSFactor?: number; UpdateFactor?: number };
    Iterations?: number;
    LineSearchDamping?: number;
    Method?: Method;
    NotDamped?: number;
    RHSMin?: number;
    RHSMinFactor?: number;
    UpdateIncrease?: number;
    UpdateMax?: number;
};

const formatCoupled = (e: CoupledType) => {
    const params = SDeviceFormat(e)({
        assign: [
            "Digits",
            "Iterations",
            "LineSearchDamping",
            "NotDamped",
            "RHSMin",
            "RHSMinFactor",
            "UpdateIncrease",
            "UpdateMax",
        ],
        block: {
            IncompleteNewton: (k) => {
                if (k === true) return [];
                return SDeviceFormat(k)({
                    assign: ["RHSFactor", "UpdateFactor"],
                });
            },
        },
        others: {
            CheckBehavior: (k, v) => [v],
            Method: (k, v) => formatMethod(v),
        },
    });
    const es = typeof e.equations === "string" ? [e.equations] : e.equations;
    return ["Coupled", "(", ...params, ")", "{", ...es, "}"];
};

type PluginType = {
    kind: "Plugin";
    equations: (Equation | CoupledType | PluginType)[];
    BreakOnFailure?: true;
    Digits?: number;
    Iterations?: number;
};

const formatPlugin = (e: PluginType) => {
    const params = SDeviceFormat(e)({
        flag: ["BreakOnFailure"],
        assign: ["Digits", "Iterations"],
    });

    const es: string[] = [];
    for (const i of e.equations) {
        if (typeof i === "string") {
            es.push(i);
            continue;
        }
        switch (i.kind) {
            case "Coupled":
                es.push(...formatCoupled(i));
                break;
            case "Plugin":
                es.push(...formatPlugin(i));
                break;
        }
    }
    return ["Plugin", "(", ...params, ")", "{", ...es, "}"];
};

type Computation = Equation | CoupledType | PluginType;

const formatComputation = (e: Computation) => {
    const retval: string[] = [];
    if (typeof e === "string") {
        retval.push(e);
    } else
        switch (e.kind) {
            case "Coupled":
                retval.push(...formatCoupled(e));
                break;
            case "Plugin":
                retval.push(...formatPlugin(e));
                break;
        }
    return retval;
};

export { formatComputation };
export type { Computation };
