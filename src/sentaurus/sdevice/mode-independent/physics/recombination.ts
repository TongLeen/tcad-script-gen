import SDeviceFormat from "../../utils/format";

type Recombination = {
    Avalanche?: Avalanche;
    eAvalanche?: Avalanche;
    hAvalanche?: Avalanche;

    Auger?: true | "WithGeneration";
    Radiative?: boolean;
    SRH?: SRH;
    CDL?: SRH;
    SurfaceSRC?: true;
    TrapAssistedAuger?: true;
    intrinsicRicher?: true;
    ConstantCarrierGeneration?: number;

    Band2Band?: Band2Band;
};

const formatRecombination = (rec: Recombination) =>
    SDeviceFormat(rec)({
        flag: ["SurfaceSRC", "TrapAssistedAuger", "intrinsicRicher"],
        switch: ["Radiative"],
        block: {
            Avalanche: formatAvalanche,
            eAvalanche: formatAvalanche,
            hAvalanche: formatAvalanche,
            Auger: (e) => (e === true ? [] : [e]),
            SRH: formatSRH,
            CDL: formatSRH,
            Band2Band: formatBand2Band,
        },
        others: {
            ConstantCarrierGeneration: (k, v) => [`${k}(value=${v})`],
        },
    });

type Avalanche = {
    BandgapDependence?: true;
    DrivingForce?:
        "ElectricField" | "Eparallel" | "GradQuasiFermi" | "CarrierTempDrive";
    model?:
        | "vanOverstraeten"
        | "Okuto"
        | "Lackner"
        | "UniBo"
        | "UniBo2"
        | "Hatakeyama";
};

const formatAvalanche = (raw: Avalanche) => {
    const { BandgapDependence, DrivingForce, model } = raw;
    const ret: string[] = [];
    if (BandgapDependence) ret.push("BandgapDependence");
    if (DrivingForce) ret.push(DrivingForce);
    if (model) ret.push(model);
    return ret;
};

type Band2Band = {
    DensityCorrection?: "Local" | "None";
    FranzDispersion?: boolean;
    InterfaceReflection?: boolean;
    Model?:
        | "E1"
        | "E1_5"
        | "E2"
        | "Hurkx"
        | "modifiedHurkx"
        | "NonlocalPath"
        | "Schenk";
    ParameterSetName?: string[];
};

const formatBand2Band = (raw: Band2Band) =>
    SDeviceFormat(raw)({
        switch: ["FranzDispersion", "InterfaceReflection"],
        assign: ["DensityCorrection", "Model"],
        others: {
            ParameterSetName: (k, v) => [
                `ParameterSetName=( ${v.map((v) => `"${v}"`).join(" ")} )`,
            ],
        },
    });

type SRH = {
    DopingDependence?: true;
    ElectricField?: {
        DensityCorrection?: "Local" | "None";
        Lifetime?: "Constant" | "Hurkx" | "Schenk";
    };
    ExpTempDependence?: true;
    NonlocalPath?: {
        Fermi?: true;
        Lifetime?: "Hurkx" | "Schenk";
        TwoBand?: true;
    };
    TempDependence?: true;
};

const formatSRH = (raw: SRH) =>
    SDeviceFormat(raw)({
        flag: ["DopingDependence", "ExpTempDependence", "TempDependence"],
        block: {
            ElectricField: (e) =>
                SDeviceFormat(e)({
                    assign: ["Lifetime", "DensityCorrection"],
                }),
            NonlocalPath: (e) =>
                SDeviceFormat(e)({
                    flag: ["Fermi", "TwoBand"],
                    assign: ["Lifetime"],
                }),
        },
    });

export { formatRecombination };
export type { Recombination };
