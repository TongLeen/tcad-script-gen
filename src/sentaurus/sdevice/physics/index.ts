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
import { type Trap } from "./trap"


type PhysicsType<M extends string, D extends string> =
    | PhysicsConfigGlobal & PhysicsConfigCommon<D>
    | PhysicsConfigMaterial<M> & PhysicsConfigCommon<D>
    | PhysicsConfigRegion & PhysicsConfigCommon<D>
    | PhysicsConfigMaterialInterface<M> & PhysicsConfigCommon<D>
    | PhysicsConfigRegionInterface & PhysicsConfigCommon<D>
    | PhysicsConfigContact


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
    PostTemperature?: true | "IV_diss" | string

    Hydrodunamic?: true | "eTemperature" | "hTemperature"

    eBarrierTunneling?: [string, BarrierTunneling]
    hBarrierTunneling?: [string, BarrierTunneling]

    Fermi?: true | "-WithJoyceDixon" | "WithFukushima"
    FermiForTEPAnalytic?: true
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