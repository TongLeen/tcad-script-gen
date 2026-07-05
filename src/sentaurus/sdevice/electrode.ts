type ElectrodeType =
    { Name: string }
    & (
        | ElectrodeVoltage
        | ElectrodeCurrent
        | ElectrodeCharge
    )
    & ElectrodeMisc


type ElectrodeVoltage = {
    kind: 'voltage'
    /**
     * 电极的电压值
     * - 可以指定一个固定值作为电极的电压
     * - 可以指定一个形如`{0:0, 1:80}`的`object`来描述瞬态仿真中分段线性的电压变化，\
     *      表示`t=0`时刻电压为`0`，`t=1`时刻电压为`80`
     */
    Voltage: number | { [key: number]: number }
    EqOhmic?: true
    Resist?: number
    DistResist?: number | "SchottkyResist"
    eRecVelocity?: number
    hRecVelocity?: number
    SRDoping?: true
} & SchottkyType

type SchottkyType =
    | { Schottky?: never }
    | { Schottky: true, barrier: BarrierType }

type BarrierType =
    | { kind: 'material', Material: ElectrodeMaterial }
    | { kind: 'barrier', Barrier: number }
    | { kind: 'workfunction', WorkFunction: number }

type ElectrodeMaterial = string | {
    material: string
    doping_type: "N" | "P"
    doping_conc: number
}


type ElectrodeCurrent = {
    kind: 'current'
    /**
     * 电极的电流值
     * @see ElectrodeVoltage.Voltage 格式参见
     */
    Current: number | { [key: number]: number }
}


type ElectrodeCharge = {
    kind: 'charge'
    /**
     * 电极的电荷量
     * @see ElectrodeVoltage.Voltage 格式参见
     */
    Charge: number | { [key: number]: number }
    /**
     * 为该电极与另一电极间增加额外电容\
     * `{value: 12, name: "Source"}` 表示当前电极与'Source'之间增加 12uF 的电容(2D:12uF/um)
     */
    FGcap?: { value: number, name: string }
    /** 给定的`Charge`将时电极与电极接触半导体的总电荷量 */
    CombineSemiAndContactCharges?: true
}

type ElectrodeMisc = {
    Poisson?: "Dirichlet" | "Neumann"
    Extraction?: { bulk?: true, drain?: true, gate?: true, source?: true }
    CyclicNorm?: never
}


const formatElectrode = (e: ElectrodeType) => {
    let retval: string[] = []
    retval.push("{")
    retval.push(`Name="${e.Name}"`)
    switch (e.kind) {
        case "voltage":
            retval.push(`Voltage=${formatPWL(e.Voltage)}`)
            if (e.EqOhmic) retval.push("EqOhmic")
            if (e.Resist) retval.push(`Resist=${e.Resist}`)
            if (e.DistResist) retval.push(`DistResist=${e.DistResist}`)
            if (e.eRecVelocity) retval.push(`eRecVelocity=${e.eRecVelocity}`)
            if (e.hRecVelocity) retval.push(`hRecVelocity=${e.hRecVelocity}`)
            if (e.SRDoping) retval.push("SRDoping")
            if (e.Schottky) {
                retval.push("Schottky")
                const b = e.barrier;
                switch (b.kind) {
                    case "material":
                        if (typeof b.Material === 'string') retval.push(`Material="${b.Material}"`)
                        else retval.push(`Material="${b.Material.material}"(${b.Material.doping_type}=${b.Material.doping_conc})`)
                        break
                    case "barrier":
                        retval.push(`Barrier=${b.Barrier}`)
                        break
                    case "workfunction":
                        retval.push(`WorkFunction=${b.WorkFunction}`)
                        break
                }
            }
            break
        case "current":
            retval.push(`Current=${formatPWL(e.Current)}`)
            break
        case "charge":
            retval.push(`Charge=${formatPWL(e.Charge)}`)
            if (e.FGcap) retval.push(`FGcap=(value=${e.FGcap.value} name="${e.FGcap.name}")`);
            if (e.CombineSemiAndContactCharges) retval.push("CombineSemiAndContactCharges");
            break
    }
    if (e.Poisson) retval.push(`Poisson=${e.Poisson}`)
    if (e.Extraction) {
        const ext = Object.entries(e.Extraction).map(([k, v]) => k)
        retval.push(`Extraction{ ${ext.join(' ')} }`)
    }
    retval.push("}")
    return retval
}

const formatPWL = (pwl: number | { [key: number]: number }) => {
    if (typeof pwl === 'number') {
        return `${pwl}`
    }
    const pairs = Object.entries(pwl)
        .map(([k, v]) => `${v} at ${k}`)
    return `( ${pairs.join(', ')} )`
}

const electrodeGenerator = (ctx: string[]) => {
    const electrode = (...args: ElectrodeType[]) => {
        ctx.push(
            "Electrode", "{",
            ...args.map(formatElectrode).flat(),
            "}"
        )
    }
    return electrode;
}

export { electrodeGenerator };
export type { ElectrodeType };