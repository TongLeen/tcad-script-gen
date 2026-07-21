import SDeviceFormat from "../utils/format";

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
    return [
        s.solver,
        "(",
        ...SDeviceFormat(s)({
            switch: [
                "IterativeRefinement",
                "MultipleRHS",
                "NonsymmetricPermutation",
                "RecomputeNonsymmetricPermutation",
            ],
            assign: ["Set"],
        }),
        ")",
    ];
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
