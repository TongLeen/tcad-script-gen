import { formatMethod, type Method } from "../../misc/linearsolver";
import useFormatUtils from "../../format-utils";
import type { Equation } from "../common/Equation";

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
    const params: string[] = [];
    const { formatAssignment, formatBlock } = useFormatUtils(params);
    if (e.CheckBehavior) params.push(e.CheckBehavior);
    formatAssignment(e, "Digits");
    formatAssignment(e, "Iterations");
    formatAssignment(e, "LineSearchDamping");
    formatAssignment(e, "NotDamped");
    formatAssignment(e, "RHSMin");
    formatAssignment(e, "RHSMinFactor");
    formatAssignment(e, "UpdateIncrease");
    formatAssignment(e, "UpdateMax");
    formatBlock(e, "IncompleteNewton", (k) => {
        if (k === true) return [];
        const l: string[] = [];
        const { formatAssignment } = useFormatUtils(l);
        formatAssignment(k, "RHSFactor");
        formatAssignment(k, "UpdateFactor");
        return l;
    });
    if (e.Method !== undefined) formatMethod(params, e.Method);
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
    const params: string[] = [];
    const { formatAssignment, formatFlag } = useFormatUtils(params);
    formatFlag(e, "BreakOnFailure");
    formatAssignment(e, "Digits");
    formatAssignment(e, "Iterations");
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

type SingleType = Equation | CoupledType | PluginType;

const formatSingle = (e: SingleType) => {
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

export { formatSingle };
export type { SingleType };
