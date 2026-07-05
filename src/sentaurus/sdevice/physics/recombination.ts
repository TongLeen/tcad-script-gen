type Recombination = {
    Avalanche?: Avalanche
    eAvalanche?: Avalanche
    hAvalanche?: Avalanche

    Auger?: true | "WithGeneration"
    Radiative?: boolean
    SRH?: SRH
    CDL?: SRH
    SurfaceSRC?: true
    TrapAssistedAuger?: true
    intrinsicRicher?: true
    ConstantCarrierGeneration?: number

    Band2Band?: Band2Band
}

const formatRecombination = (rec: Recombination) => {

}

type Avalanche = {
    BandgapDependence?: boolean
    DrivingForce?:
    | "ElectricField"
    | "Eparallel"
    | "GradQuasiFermi"
    | "CarrierTempDrive"
    model?:
    | "vanOverstraeten"
    | "Okuto"
    | "Lackner"
    | "UniBo"
    | "UniBo2"
    | "Hatakeyama"
}

const formatAvalanche = (raw: Avalanche) => {
    const { BandgapDependence, DrivingForce, model } = raw
    const ret: string[] = []
    if (BandgapDependence) ret.push((BandgapDependence ? "+" : "-") + "BandgapDependence")
    if (DrivingForce) ret.push(DrivingForce)
    if (model) ret.push(model)
    return ret
}


type Band2Band = {
    DensityCorrection?: "Local" | "None"
    FranzDispersion?: boolean
    InterfaceReflection?: boolean
    Model?:
    | "E1"
    | "E1_5"
    | "E2"
    | "Hurkx"
    | "modifiedHurkx"
    | "NonlocalPath"
    | "Schenk"
    ParameterSetName?: string[]
}

const formatBand2Band = (raw: Band2Band) => {
    const { DensityCorrection, Model, ParameterSetName, ...sw } = raw

    const ret: string[] = []
    ret.push(...Object.entries(sw).map(([k, v]) => (v ? "+" : "-") + k))
    if (DensityCorrection) ret.push(`DensityCorrection=${DensityCorrection}`)
    if (Model) ret.push(`Model=${Model}`)
    if (ParameterSetName) ret.push(`ParameterSetName=( ${ParameterSetName
        .map((v) => `"${v}"`)
        .join(' ')} )`)
    return ret
}


type SRH = {
    DopingDependence?: true
    ElectricField?: {
        DensityCorrection?: "Local" | "None"
        Lifetime?: "Constant" | "Hurkx" | "Schenk"
    }
    ExpTempDependence?: true
    NonlocalPath?: {
        Fermi?: true
        Lifetime?: "Hurkx" | "Schenk"
        TwoBand?: true
    }
    TempDependence?: true
}

function formatSRH(raw: SRH) {
    const { ElectricField, NonlocalPath, ...flags } = raw

    const ret = Object.keys(flags)
    if (ElectricField) {
        const a: string[] = []
        const { DensityCorrection, Lifetime } = ElectricField
        if (DensityCorrection) a.push(`DensityCorrection=${DensityCorrection}`)
        if (Lifetime) a.push(`Lifetime=${Lifetime}`)
        ret.push("(", ...a, ")")
    }
    if (NonlocalPath) {
        const { Lifetime, ...flags } = NonlocalPath
        const a: string[] = Object.keys(flags)
        if (Lifetime) a.push(`Lifetime=${Lifetime}`)
        ret.push("(", ...a, ")")
    }
    return ret
}


export { formatRecombination };
export type { Recombination };
