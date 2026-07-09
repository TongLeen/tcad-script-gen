import useFormatUtils from "./format-utils"
import { formatMethod, type Method } from "./misc/linearsolver";

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
    CheckBehavior?: "CheckRhsAfterUpdate" | "RhsAndUpdateConvergence"
}

const formatConvergenceControl = (raw: ConvergenceControl) => {
    const retval: string[] = []
    const { formatAssignment } = useFormatUtils(retval)
    formatAssignment(raw, "RHSMin")
    formatAssignment(raw, "RHSMinFactor")
    formatAssignment(raw, "Digits")
    formatAssignment(raw, "RHSFactor")
    formatAssignment(raw, "RHSMax")
    if (raw.CheckBehavior) retval.push(raw.CheckBehavior)
    if (raw.ErrRef) {
        const r = raw.ErrRef
        if (r.Electron) retval.push(`ErrRef(Electron)=${r.Electron}`)
        if (r.Hole) retval.push(`ErrRef(Hole)=${r.Hole}`)
    }
    return retval
}

type ErrRef = {
    Electron?: number
    Hole?: number
}

type ComputationControl = {
    ExitOnFailure?: true
    Transient?: "BE" | "TRBDF"
    Extrapolate?: true | Extrapolate
    Iterations?: number
    Threads?: number | { Assembly: number, Solver: number }
    Method?: Method
}

const formatComputationControl = (raw: ComputationControl) => {
    const retval: string[] = []
    const { formatFlag, formatAssignment, formatBlock } = useFormatUtils(retval)
    formatFlag(raw, "ExitOnFailure")
    formatAssignment(raw, "Transient")
    formatAssignment(raw, "Iterations")
    formatBlock(raw, "Extrapolate", (e) => {
        if (e === true) return []
        const l: string[] = []
        const { formatFlag, formatAssignment, formatBlock } = useFormatUtils(l)
        formatAssignment(e, "Algorithm")
        formatAssignment(e, "LowDensityLimit")
        formatAssignment(e, "MinStep")
        formatAssignment(e, "NumberOfFailures")
        formatAssignment(e, "Order")
        return l
    })
    if (raw.Threads !== undefined) {
        if (typeof raw.Threads === 'number') retval.push(`NumberOfThreads=${raw.Threads}`)
        else retval.push(
            `NumberOfAssemblyThreads=${raw.Threads.Assembly}`,
            `NumberOfSolverThreads=${raw.Threads.Solver}`,
        )
    }
    if (raw.Method !== undefined) formatMethod(retval, raw.Method)
    // if (raw.Method !== undefined) {
    //     const M = raw.Method
    //     if (typeof M === 'object' && M.solver === 'Blocked') {
    //         retval.push("Method=Blocked")
    //         retval.push("SubMethod", "=", ...formatLinearSolver(M.sub))
    //     }
    //     else retval.push("Method", "=", ...formatLinearSolver(M))
    // }
    return retval
}

type Extrapolate = {
    Algorithm?: 1 | 2
    Exclude?: never
    LowDensityLimit?: number
    MinStep?: number
    NumberOfFailures?: number
    Order?: number
}


type ValueControl = {
    DirectCurrentComputation?: true
    ExtendedPrecision?: true | 64 | 80 | 128 | 256
    Derivatives?: boolean
    AvalDerivatives?: boolean
    RefDens_eGradQuasiFermi_ElectricField?: number
}

const formatValueControl = (raw: ValueControl) => {
    const retval: string[] = []
    const { formatFlag, formatBlock, formatSwitch, formatAssignment } = useFormatUtils(retval)
    formatFlag(raw, "DirectCurrentComputation")
    formatBlock(raw, "ExtendedPrecision", (e) => (e === true) ? [] : [`${e}`])
    formatSwitch(raw, "AvalDerivatives")
    formatSwitch(raw, "Derivatives")
    formatAssignment(raw, "RefDens_eGradQuasiFermi_ElectricField")
    return retval
}

type Nonlocal<M extends string> = {
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

const formatNonlocal = <M extends string>(n: Nonlocal<M>) => {
    const retval: string[] = []
    const { formatAssignment } = useFormatUtils(retval)
    formatAssignment(n, "Digits")
    formatAssignment(n, "Electrode", (k, v) => `${k}="${v}"`)
    formatAssignment(n, "Length")
    formatAssignment(n, "EnergyResolution")
    formatAssignment(n, "MaxAngle")
    retval.push(`Direction=(${n.Direction.join(' ')})`)
    if (n.EndPoints) {
        n.EndPoints.map((e) => `${e.enable ? "+" : "-"}EndPoint(Material="${e.material}")`)
    }
    return retval
}

const mathGenerator = <M extends string>(ctx: string[]) => {
    const math = (m: MathType, nonlocalmesh?: Record<string, Nonlocal<M>>) => {
        const ll: string[][] = []
        ll.push(
            formatConvergenceControl(m),
            formatComputationControl(m),
            formatValueControl(m),
        )
        if (nonlocalmesh) {
            Object.entries(nonlocalmesh).forEach(([k, v]) => {
                ll.push(["NonLocal", `"${k}"`, "(", ...formatNonlocal(v), ")"])
            })
        }
        ctx.push("Math", "{", ...ll.flat(), "}")
    }
    return math;
}

export { mathGenerator };
export type { MathType };
