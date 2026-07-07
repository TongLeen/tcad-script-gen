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
import useFormatUtils from "../format-utils"


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

const formatContact = (raw: PhysicsConfigContact) => {
    return (raw.BarrierLowering) ? ["BarrierLowering"] : []
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
    const { formatAssignment, formatBlock } = useFormatUtils(retval)
    formatBlock(raw, "Recombination", formatRecombination)
    formatBlock(raw, "Aniso", formatAniso)
    formatBlock(raw, "IncompleteIonization", formatIncompleteIonization)
    formatBlock(raw, "BreakdownProbability", (e) => {
        let l: string[] = []
        const { formatAssignment, formatFlag } = useFormatUtils(l)
        formatAssignment(e, "MinElectricField")
        formatFlag(e, "InterpolatedDiscretization")
        return l
    })
    formatBlock(raw, "Piezoelectric_Polarization", (e) => {
        let l: string[] = [e.force]
        const { formatAssignment } = useFormatUtils(l)
        formatAssignment(e, "activation")
        return l
    })
    formatAssignment(raw, "LatticeTemperatureLimit")
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
    const { formatFlag, formatAssignment, formatBlock } = useFormatUtils(retval)
    formatFlag(raw, "DefaultParametersFromFile")
    formatFlag(raw, "FermiForTEPAnalytic")
    formatAssignment(raw, "AreaFactor")
    formatAssignment(raw, "Temperature")
    formatBlock(raw, "Thermodynamic",
        (e) => (e === true ? [] : [e]),
    )
    formatBlock(raw, "PostTemperature", (e) => {
        if (e === true) return []
        const { IV_diss } = e
        if (IV_diss === true) return ["IV_diss"]
        else return [`IV_diss(${IV_diss})`]
    })
    formatBlock(raw, "Hydrodynamic", (e) => {
        if (e === true) return []
        else return [e]
    })

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
    formatBlock(raw, "Fermi", (e) => {
        return e === true ? [] : [e]
    })
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
    const { formatFlag, formatAssignment, formatBlock } = useFormatUtils(retval)
    formatBlock(raw, "EffectiveIntrinsicDensity", formatEffectiveIntrinsicDensity)
    formatBlock(raw, "Mobility", formatMobility)
    formatBlock(raw, "eMobility", formatMobility)
    formatBlock(raw, "hMobility", formatMobility)
    formatAssignment(raw, "eQuasiFermi")
    formatAssignment(raw, "hQuasiFermi")
    formatAssignment(raw, "HeatPreFactor")
    formatBlock(raw, "Traps", (e) => {
        return e.map(formatTraps).map(
            (v) => ["(", ...v, ")"],
        ).flat()
    })
    formatFlag(raw, "GaussianDOS_full")
    formatBlock(raw, "TEPower", (e) => [e])
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


const formatInterface = (raw: PhysicsConfigInterface) => {
    const retval: string[] = []
    const { formatFlag, formatBlock, formatAssignment } = useFormatUtils(retval)
    formatFlag(raw, "Dipole")
    formatAssignment(raw, "DistResist")
    formatAssignment(raw, "MSDistResist")
    formatBlock(raw, "Traps", (e) => {
        return e.map(formatTraps).map(
            (v) => ["(", ...v, ")"],
        ).flat()
    })
    formatAssignment(raw, "eRecVelocity")
    formatAssignment(raw, "hRecVelocity")
    formatFlag(raw, "HeteroInterface")
    formatFlag(raw, "Schottky")
    formatFlag(raw, "Schroedinger")
    formatAssignment(raw, "TATNonlocalPathNC")
    formatBlock(raw, "Thermionic", (e) => {
        return e === true ? [] : [e]
    })
    return retval
}

const physicsGenerator = <M extends string, D extends string>(ctx: string[]) => {
    const phy = (p: PhysicsType<M, D>) => {
        const retval: string[] = ["Physics"]
        switch (p.kind) {
            case "Global":
                retval.push("{", ...formatGlobal(p))
                break
            case "Region":
                retval.push(`(Region="${p.region}")`)
                retval.push("{", ...formatBulk(p))
                break
            case "RegionInterface":
                retval.push(`(RegionInterface="${p.regions.join('/')}")`)
                retval.push("{", ...formatInterface(p))
                break
            case "Contact":
                retval.push(`(Contact="${p.contact}")`)
                retval.push("{", ...formatContact(p))
                break
            case "Material":
                retval.push(`(Material="${p.material}")`)
                retval.push("{", ...formatBulk(p))
                break
            case "MaterialInterface":
                retval.push(`(MaterialInterface="${p.materials.join('/')}")`)
                retval.push("{", ...formatInterface(p))
                break
        }
        retval.push(...formatCommon(p), "}")
        return retval
    }
    return phy;
}

export { physicsGenerator };
export type { PhysicsType };