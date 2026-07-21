import SDeviceFormat from "../format";

type Mobility = {
    DopingDependence?: DopingDependence;

    HighFieldSaturation?: HighFieldSaturation;
    eHighFieldSaturation?: HighFieldSaturation;
    hHighFieldSaturation?: HighFieldSaturation;

    Enormal?: Enormal;
    ToCurrentEnormal?: Enormal;

    PhuMob?: true | "Arsenic" | "Phosphorus";
    CarrierCarrierScattering?: true | "BrooksHerring" | "ConwellWeisskopf";
    ConstantMobility?: boolean;

    Diffusivity?: HighFieldSaturation;
    eDiffusivity?: HighFieldSaturation;
    hDiffusivity?: HighFieldSaturation;

    IncompleteIonization?: true;
    MultiValley?: true;
    Tunneling?: boolean;
};

const formatMobility = (m: Mobility) =>
    SDeviceFormat(m)({
        flag: ["IncompleteIonization", "MultiValley"],
        switch: ["ConstantMobility", "Tunneling"],
        block: {
            DopingDependence: formatDopingDependence,
            HighFieldSaturation: formatHighFieldSaturation,
            eHighFieldSaturation: formatHighFieldSaturation,
            hHighFieldSaturation: formatHighFieldSaturation,
            Enormal: formatEnormal,
            ToCurrentEnormal: formatEnormal,
            PhuMob: (v) => (v === true ? [] : [v]),
            CarrierCarrierScattering: (v) => (v === true ? [] : [v]),
            Diffusivity: formatHighFieldSaturation,
            eDiffusivity: formatHighFieldSaturation,
            hDiffusivity: formatHighFieldSaturation,
        },
    });

type DopingDependence = {
    Arora?: true;
    BalMob?: { Lch: number } | true;
    Masetti?: true;
    PhuMob?: true;
    PhuMob2?: true;
    UniBo?: true;
};

const formatDopingDependence = (raw: DopingDependence) =>
    SDeviceFormat(raw)({
        flag: ["Arora", "Masetti", "PhuMob", "PhuMob2", "UniBo"],
        block: {
            BalMob: (v) => (v === true ? [] : [`Lch=${v.Lch}`]),
        },
    });

type HighFieldSaturation = {
    DrivingForce?:
        | "GradQuasiFermi"
        | "CarrierTempDrive"
        | "CarrierTempDriveBasic"
        | "CarrierTempDriveME"
        | "CarrierTempDrivePolynomial"
        | "CarrierTempDriveSpline"
        | "Eparallel"
        | "EparallelToInterface"
        | "ElectricField";
    model?:
        | "CaugheyThomas"
        | "DensityDependentVsat"
        | "PFMob"
        | "TransferredElectronEffect"
        | "TransferredElectronEffect2"
        | "VRHMob";
};

const formatHighFieldSaturation = (raw: HighFieldSaturation) =>
    SDeviceFormat(raw)({
        others: {
            DrivingForce: (_, v) => [v],
            model: (_, v) => [v],
        },
    });

type EnormalIALMob = {
    AutoOrientation?: boolean;
    ClusteringEverywhere?: boolean;
    FullPhuMob?: boolean;
    ParameterSetName?: string;
    PhononCombination?: 0 | 1 | 2;
};

const formatEnormalIALMob = (raw: EnormalIALMob) =>
    SDeviceFormat(raw)({
        switch: ["AutoOrientation", "ClusteringEverywhere", "FullPhuMob"],
        assignString: ["ParameterSetName"],
        assign: ["PhononCombination"],
    });

type EnormalLombardi = {
    AutoOrientation?: boolean;
    ParameterSetName?: string;
};

const formatEnormalLombardi = (raw: EnormalLombardi) =>
    SDeviceFormat(raw)({
        switch: ["AutoOrientation"],
        assignString: ["ParameterSetName"],
    });

type Enormal = {
    Coulomb2D?: true;
    IALMob?: EnormalIALMob;
    InterfaceCharge?: true;
    Lombardi?: EnormalLombardi;
    Lombardi_highk?: true;
    NegInterfaceCharge?: true;
    PosInterfaceCharge?: true;
    RCS?: true;
    RPS?: true;
    UniBo?: true;
};

const formatEnormal = (raw: Enormal) =>
    SDeviceFormat(raw)({
        flag: [
            "Coulomb2D",
            "InterfaceCharge",
            "Lombardi_highk",
            "NegInterfaceCharge",
            "PosInterfaceCharge",
            "RCS",
            "RPS",
            "UniBo",
        ],
        block: {
            IALMob: formatEnormalIALMob,
            Lombardi: formatEnormalLombardi,
        },
    });

export { formatMobility };
export type { Mobility };
