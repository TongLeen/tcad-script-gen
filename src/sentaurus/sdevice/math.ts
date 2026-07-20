import SDeviceFormat from "./format";
import { formatMethod, type Method } from "./misc/linearsolver";

type MathType = ConvergenceControl & ComputationControl & ValueControl;

type ConvergenceControl = {
    RHSMin?: number;
    RHSMinFactor?: number;
    Digits?: number;
    ErrRef?: ErrRef;
    RHSFactor?: number;
    RHSMax?: number;
    CheckBehavior?: "CheckRhsAfterUpdate" | "RhsAndUpdateConvergence";
};

const formatConvergenceControl = (raw: ConvergenceControl) =>
    SDeviceFormat(raw)({
        assign: ["RHSMin", "RHSMinFactor", "RHSMax", "RHSFactor", "Digits"],
        others: {
            CheckBehavior: (k, v) => [v],
            ErrRef: (_, v) => {
                const r: string[] = [];
                if (v.Electron) r.push(`ErrRef(Electron)=${v.Electron}`);
                if (v.Hole) r.push(`ErrRef(Hole)=${v.Hole}`);
                return r;
            },
        },
    });

type ErrRef = {
    Electron?: number;
    Hole?: number;
};

type ComputationControl = {
    ExitOnFailure?: true;
    Transient?: "BE" | "TRBDF";
    Extrapolate?: true | Extrapolate;
    Iterations?: number;
    Threads?: number | { Assembly: number; Solver: number };
    Method?: Method;
};

const formatComputationControl = (raw: ComputationControl) =>
    SDeviceFormat(raw)({
        flag: ["ExitOnFailure"],
        assign: ["Transient", "Iterations"],
        block: {
            Extrapolate: (v) => {
                if (v === true) return [];
                else
                    return SDeviceFormat(v)({
                        assign: [
                            "Algorithm",
                            "LowDensityLimit",
                            "MinStep",
                            "NumberOfFailures",
                            "Order",
                        ],
                    });
            },
        },
        others: {
            Method: (k, v) => formatMethod(v),
            Threads: (k, v) => {
                const retval: string[] = [];
                if (typeof v === "number")
                    retval.push(`NumberOfThreads=${raw.Threads}`);
                else
                    retval.push(
                        `NumberOfAssemblyThreads=${v.Assembly}`,
                        `NumberOfSolverThreads=${v.Solver}`,
                    );
                return retval;
            },
        },
    });

type Extrapolate = {
    Algorithm?: 1 | 2;
    Exclude?: never;
    LowDensityLimit?: number;
    MinStep?: number;
    NumberOfFailures?: number;
    Order?: number;
};

type ValueControl = {
    DirectCurrentComputation?: true;
    ExtendedPrecision?: true | 64 | 80 | 128 | 256;
    Derivatives?: boolean;
    AvalDerivatives?: boolean;
    RefDens_eGradQuasiFermi_ElectricField?: number;
};

const formatValueControl = (raw: ValueControl) =>
    SDeviceFormat(raw)({
        flag: ["DirectCurrentComputation"],
        switch: ["AvalDerivatives", "Derivatives"],
        assign: ["RefDens_eGradQuasiFermi_ElectricField"],
        block: {
            ExtendedPrecision: (e) => (e === true ? [] : [`${e}`]),
        },
    });

type Location<M extends string> =
    | ({ Region: string } & { Material?: never })
    | ({ Material: M } & { Region?: never });

type NonlocalPosition<M extends string> =
    | { kind: "Barrier"; location: Location<M> }
    | { kind: "Electrode"; Electrode: string }
    | { kind: "RegionInterface"; RegionInterface: [string, string] }
    | { kind: "MaterialInterface"; MaterialInterface: [M, M] };

type Nonlocal<M extends string> = NonlocalPosition<M> & {
    Digits: number;
    Length: number;
    EnergyResolution: number;
    Direction: [number, number, number];
    MaxAngle: number;
    EndPoints?: EndPoint<M>[];
};
type EndPoint<M extends string> = {
    enable: boolean;
    location: Location<M>;
};

const formatNonlocal = <M extends string>(n: Nonlocal<M>) =>
    SDeviceFormat(n)({
        assign: ["Digits", "Length", "EnergyResolution", "MaxAngle"],
        assignString: ["Electrode" as any],
        others: {
            RegionInterface: (_, v) => [`RegionInterface="${v[0]}/${v[1]}"`],
            MaterialInterface: (_, v) => [
                `MaterialInterface="${v[0]}/${v[1]}"`,
            ],
            Direction: (_, v) => [`Direction=(${v.join(" ")})`],
            EndPoints: (_, v) => {
                const ll = v.map((v) => [
                    `${v.enable ? "+" : "-"}EndPoint`,
                    "(",
                    v.location.Material !== undefined
                        ? `Material="${v.location.Material}"`
                        : `Region="${v.location.Region}"`,
                    ")",
                ]);
                return ll.flat();
            },
            location: (_, v) => [
                "Barrier",
                "(",
                v.Material !== undefined
                    ? `Material="${v.Material}"`
                    : `Region="${v.Region}"`,
                ")",
            ],
        },
    });

const mathGenerator = <M extends string>(ctx: string[]) => {
    const math = (m: MathType, nonlocalmesh?: Record<string, Nonlocal<M>>) => {
        const ll: string[][] = [];
        ll.push(
            formatConvergenceControl(m),
            formatComputationControl(m),
            formatValueControl(m),
        );
        if (nonlocalmesh) {
            Object.entries(nonlocalmesh).forEach(([k, v]) => {
                ll.push(["NonLocal", `"${k}"`, "(", ...formatNonlocal(v), ")"]);
            });
        }
        ctx.push("Math", "{", ...ll.flat(), "}");
    };
    return math;
};

export { mathGenerator };
export type { MathType };
