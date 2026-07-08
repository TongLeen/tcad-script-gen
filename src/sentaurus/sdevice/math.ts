type MathType =
    & ConvergenceControl
    & ComputationControl
    & ValueControl

type ConvergenceControl = {
    RHSMin?: number
    RHSMinFactor?: number
    Digits?: number
    ErrRef?: ErrRef
    RHSFactor?: number
    RHSMax?: number
    CheckBehavior?: "CheckRhsAfterUpdate"
}

type ErrRef = {
    Electron?: number
    Hole?: number
}

type ComputationControl = {
    FailureBehavior?: "ExitOnFailure"
    Transient?: "BE" | "TRBDF"
    Extrapolate?: true | Extrapolate
    Iterations?: number
    Threads?: number | { Assembly: number, Solver: number }
    Method?: Method
}

type Extrapolate = {
    Algorithm?: 1 | 2
    Exclude?: never
    LowDensityLimit?: number
    MinStep?: number
    NumberOfFailures?: number
    Order?: number
}

type LinearSolver = "Super" | "ParDiSo" | "ILS"
    | {
        solver: "ParDiSo",
        IterativeRefinement?: boolean,
        MultipleRHS?: boolean,
        NonsymmetricPermutation?: boolean,
        RecomputeNonsymmetricPermutation?: boolean,
    }
    | {
        solver: "ILS",
        MultipleRHS?: boolean,
        Set?: number,
    }

type Method = LinearSolver | {
    main: "Blocked"
    sub: LinearSolver
}

type ValueControl = {
    DirectCurrentComputation?: true
    ExtendedPrecision?: true | 64 | 80 | 128 | 256
    Derivatives?: boolean
    AvalDerivatives?: boolean
    RefDens_eGradQuasiFermi_ElectricField?: number
}

type NonlocalConfig<M extends string> = {
    Electrode: string
    Digits: number
    Length: number
    EnergyResolution: number
    Direction: [number, number, number]
    MaxAngle: number
    EndPoints?: EndPoint<M>[]
}
type EndPoint<M extends string> = {
    enable: boolean
    material: M
}

const mathGenerator = <M extends string>(ctx: string[]) => {
    const math = (m: MathType, nonlocalmesh?: Record<string, NonlocalConfig<M>>) => {

    }
    return math;
}

export { mathGenerator };
export type { MathType };
