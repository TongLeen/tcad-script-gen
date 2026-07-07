import useFormatUtils from "../format-utils"

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
    let retval: string[] = []
    const { formatFlag, formatSwitch, formatBlock, formatAssignment } = useFormatUtils(retval)
    formatFlag(rec, "SurfaceSRC")
    formatFlag(rec, "TrapAssistedAuger")
    formatFlag(rec, "intrinsicRicher")
    formatBlock(rec, "Avalanche", formatAvalanche)
    formatBlock(rec, "eAvalanche", formatAvalanche)
    formatBlock(rec, "hAvalanche", formatAvalanche)
    formatBlock(rec, "Auger", (e) => {
        return e === true ? [] : [e]
    })
    formatSwitch(rec, "Radiative")
    formatBlock(rec, "SRH", formatSRH)
    formatBlock(rec, "CDL", formatSRH)
    formatBlock(rec, "Band2Band", formatBand2Band)
    formatAssignment(rec, "ConstantCarrierGeneration", (k, v) => `${k}(value=${v})`)
    return retval
}

type Avalanche = {
    BandgapDependence?: true
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
    if (BandgapDependence) ret.push("BandgapDependence")
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
    const { DensityCorrection, Model, ParameterSetName } = raw

    const ret: string[] = []
    const { formatSwitch } = useFormatUtils(ret)
    formatSwitch(raw, "FranzDispersion")
    formatSwitch(raw, "InterfaceReflection")
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

const formatSRH = (raw: SRH) => {
    const retval: string[] = []
    const { formatFlag, formatBlock } = useFormatUtils(retval)
    formatFlag(raw, "DopingDependence")
    formatFlag(raw, "ExpTempDependence")
    formatFlag(raw, "TempDependence")
    formatBlock(raw, "ElectricField", (e) => {
        const l: string[] = []
        const { formatAssignment } = useFormatUtils(l)
        formatAssignment(e, "DensityCorrection")
        formatAssignment(e, "Lifetime")
        return l
    })
    formatBlock(raw, "NonlocalPath", (e) => {
        const l: string[] = []
        const { formatAssignment } = useFormatUtils(l)
        formatFlag(e, "Fermi")
        formatFlag(e, "TwoBand")
        formatAssignment(e, "Lifetime")
        return l
    })
    return retval
}


export { formatRecombination };
export type { Recombination };
