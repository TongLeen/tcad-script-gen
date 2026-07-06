import { formatMobility, type Mobility } from "./mobility"
import { formatRecombination, type Recombination } from "./recombination"
import {
    formatAniso,
    formatBarrierTunneling,
    formatEffectiveIntrinsicDensity,
    formatIncompleteIonization,
    type Aniso,
    type BarrierTunneling,
    type EffectiveIntrinsicDensity,
    type IncompleteIonization,
} from './misc'
import { formatTraps, type Trap } from "./trap"


type PhysicsType<M extends string, D extends string> = (
    | PhysicsConfigGlobal
    | PhysicsConfigMaterial<M>
    | PhysicsConfigRegion
    | PhysicsConfigMaterialInterface<M>
    | PhysicsConfigRegionInterface
    | PhysicsConfigContact
) & PhysicsConfigCommon<D>


type PhysicsConfigMaterial<M extends string> = {
    kind: "Material",
    material: M
} & PhysicsConfigBulk

type PhysicsConfigRegion = {
    kind: "Region",
    region: string
} & PhysicsConfigBulk

type PhysicsConfigMaterialInterface<M extends string> = {
    kind: "MaterialInterface",
    materials: [M, M]
} & PhysicsConfigInterface

type PhysicsConfigRegionInterface = {
    kind: "RegionInterface",
    regions: [string, string]
} & PhysicsConfigInterface

type PhysicsConfigContact = {
    kind: 'Contact'
    contact: string
    BarrierLowering?: true
}


type PhysicsConfigCommon<D extends string> = {
    Recombination?: Recombination
    Aniso?: Aniso
    IncompleteIonization?: IncompleteIonization<D>
    BreakdownProbability?: { InterpolatedDiscretization?: true, MinElectricField?: number }
    Piezoelectric_Polarization?: {
        force: "strain" | "stress"
        activation?: number
    }
    LatticeTemperatureLimit?: number
}

const formatCommon = <D extends string>(raw: PhysicsConfigCommon<D>) => {
    let retval: string[] = []
    if (raw.Recombination) retval.push(...formatRecombination(raw.Recombination))
    if (raw.Aniso) retval.push(...formatAniso(raw.Aniso))
    if (raw.IncompleteIonization) retval.push(...formatIncompleteIonization(raw.IncompleteIonization))
    if (raw.BreakdownProbability) {
        const a = raw.BreakdownProbability.InterpolatedDiscretization ? "InterpolatedDiscretization" : ''
        const b = raw.BreakdownProbability.MinElectricField === undefined ? '' : `MinElectricField=${raw.BreakdownProbability.MinElectricField}`
        retval.push(`BreakdownProbability( ${a} ${b})`)
    }
    if (raw.Piezoelectric_Polarization) {
        const f = raw.Piezoelectric_Polarization.force
        const a = raw.Piezoelectric_Polarization.activation === undefined ? '' : `activation=${raw.Piezoelectric_Polarization.activation}`
        retval.push(`Piezoelectric_Polarization(${f} ${a})`)
    }
    if (raw.LatticeTemperatureLimit) retval.push(`LatticeTemperatureLimit=${raw.LatticeTemperatureLimit}`)
    return retval
}

type PhysicsConfigGlobal = {
    kind: 'Global'
    DefaultParametersFromFile?: true
    AreaFactor?: number

    Thermodynamic?: true | "HLLTunnelingRecGenHeat"
    Temperature?: number
    PostTemperature?: true | { IV_diss: true | string }

    Hydrodynamic?: true | "eTemperature" | "hTemperature"

    eBarrierTunneling?: Record<string, BarrierTunneling | null>
    hBarrierTunneling?: Record<string, BarrierTunneling | null>

    Fermi?: true | "-WithJoyceDixon" | "WithFukushima"
    FermiForTEPAnalytic?: true
}

const formatGlobal = (raw: PhysicsConfigGlobal) => {
    let retval: string[] = []

    if (raw.DefaultParametersFromFile) retval.push("DefaultParametersFromFile")
    if (raw.AreaFactor) retval.push(`AreaFactor=${raw.AreaFactor}`)
    if (raw.Thermodynamic !== undefined) {
        if (raw.Thermodynamic === true) retval.push("Thermodynamic")
        else retval.push(`Thermodynamic(${raw.Thermodynamic})`)
    }
    if (raw.Temperature !== undefined) retval.push(`Temperature=${raw.Temperature}`)
    if (raw.PostTemperature !== undefined) {
        const p = raw.PostTemperature
        if (p === true) retval.push("PostTemperature")
        else if (p.IV_diss === true) retval.push("PostTemperature(IV_diss)")
        else retval.push(`PostTemperature(IV_diss(${p.IV_diss}))`)
    }
    if (raw.Hydrodynamic) {
        if (raw.Hydrodynamic === true) retval.push("Hydrodunamic")
        else retval.push(`Hydrodunamic(${raw.Hydrodynamic})`)
    }
    if (raw.eBarrierTunneling) {
        Object.entries(raw.eBarrierTunneling).forEach(([name, ebt]) => {
            retval.push("eBarrierTunneling", `"${name}"`)
            if (ebt) retval.push("(", ...formatBarrierTunneling(ebt), ")")
        })
    }
    if (raw.hBarrierTunneling) {
        Object.entries(raw.hBarrierTunneling).forEach(([name, hbt]) => {
            retval.push("hBarrierTunneling", `"${name}"`)
            if (hbt) retval.push("(", ...formatBarrierTunneling(hbt), ")")
        })
    }
    if (raw.Fermi) {
        if (raw.Fermi === true) retval.push("Fermi")
        else retval.push(`Fermi(${raw.Fermi})`)
    }
    if (raw.FermiForTEPAnalytic) retval.push("FermiForTEPAnalytic")
    return retval
}

type PhysicsConfigBulk = {
    EffectiveIntrinsicDensity?: EffectiveIntrinsicDensity

    Mobility?: Mobility
    eMobility?: Mobility
    hMobility?: Mobility

    eQuasiFermi?: number
    hQuasiFermi?: number

    Traps?: Trap[]

    GaussianDOS_full?: true
    HeatPreFactor?: number
    TEPower?: "Analytic" | "Tabulated_Si"
}

const formatBulk = (raw: PhysicsConfigBulk) => {
    let retval: string[] = []
    if (raw.EffectiveIntrinsicDensity)
        retval.push("EffectiveIntrinsicDensity", "(", ...formatEffectiveIntrinsicDensity(raw.EffectiveIntrinsicDensity), ")")
    if (raw.Mobility) retval.push("Mobility", "(", ...formatMobility(raw.Mobility), ")")
    if (raw.eMobility) retval.push("eMobility", "(", ...formatMobility(raw.eMobility), ")")
    if (raw.hMobility) retval.push("hMobility", "(", ...formatMobility(raw.hMobility), ")")
    if (raw.eQuasiFermi) retval.push(`eQuasiFermi=${raw.eQuasiFermi}`)
    if (raw.hQuasiFermi) retval.push(`hQuasiFermi=${raw.hQuasiFermi}`)
    if (raw.Traps) retval.push("Traps", "(", ...(() => raw.Traps.map(formatTraps).map((v) => ["(", ...v, ")"]).flat())(), ")")
    if (raw.GaussianDOS_full) retval.push("GaussianDOS_full")
    if (raw.HeatPreFactor) retval.push(`HeatPreFactor=${raw.HeatPreFactor}`)
    if (raw.TEPower) retval.push(`TEPower(${raw.TEPower})`)
    return retval
}

type PhysicsConfigInterface = {
    Dipole?: true
    DistResist?: DistResist
    MSDistResist?: DistResist

    Traps?: Trap[]

    eRecVelocity?: number
    hRecVelocity?: number

    HeteroInterface?: true

    Schottky?: true
    Schroedinger?: true

    TATNonlocalPathNC?: number
    Thermionic?: true | "HCI" | "Organic_Gaussian"
}
type DistResist = number | "SchottkyResist"


const physicsGenerator = <M extends string, D extends string>(ctx: string[]) => {
    const phy = (p: PhysicsType<M, D>) => {

    }
    return phy;
}

export { physicsGenerator };
export type { PhysicsType };