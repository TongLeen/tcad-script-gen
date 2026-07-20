import useFormatUtils from "../format-utils";

type LinearSolver =
    | "Super"
    | "ParDiSo"
    | "ILS"
    | {
          solver: "ParDiSo";
          IterativeRefinement?: boolean;
          MultipleRHS?: boolean;
          NonsymmetricPermutation?: boolean;
          RecomputeNonsymmetricPermutation?: boolean;
      }
    | {
          solver: "ILS";
          MultipleRHS?: boolean;
          Set?: number;
      };
const formatLinearSolver = (s: LinearSolver) => {
    if (typeof s === "string") return [s];

    const retval: string[] = [s.solver, "("];
    const { formatSwitch, formatAssignment } = useFormatUtils(retval);
    switch (s.solver) {
        case "ParDiSo":
            formatSwitch(s, "IterativeRefinement");
            formatSwitch(s, "MultipleRHS");
            formatSwitch(s, "NonsymmetricPermutation");
            formatSwitch(s, "RecomputeNonsymmetricPermutation");
            break;
        case "ILS":
            formatSwitch(s, "MultipleRHS");
            formatAssignment(s, "Set");
            break;
    }
    retval.push(")");
    return retval;
};
type Method =
    | LinearSolver
    | {
          solver: "Blocked";
          sub: LinearSolver;
      };
const formatMethod = (m: Method) => {
    const retval: string[] = [];
    if (m !== undefined) {
        if (typeof m === "object" && m.solver === "Blocked") {
            retval.push("Method=Blocked");
            retval.push("SubMethod", "=", ...formatLinearSolver(m.sub));
        } else retval.push("Method", "=", ...formatLinearSolver(m));
    }
    return retval;
};
export { formatLinearSolver, formatMethod };
export type { LinearSolver, Method };
