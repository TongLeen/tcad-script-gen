import useFormatUtils from "../format-utils";

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

const formatMobility = (m: Mobility) => {
    let retval: string[] = [];
    if (m.DopingDependence)
        retval.push(
            "DopingDependence",
            "(",
            ...formatDopingDependence(m.DopingDependence),
            ")",
        );
    if (m.HighFieldSaturation)
        retval.push(
            "HighFieldSaturation",
            "(",
            ...formatHighFieldSaturation(m.HighFieldSaturation),
            ")",
        );
    if (m.eHighFieldSaturation)
        retval.push(
            "eHighFieldSaturation",
            "(",
            ...formatHighFieldSaturation(m.eHighFieldSaturation),
            ")",
        );
    if (m.hHighFieldSaturation)
        retval.push(
            "hHighFieldSaturation",
            "(",
            ...formatHighFieldSaturation(m.hHighFieldSaturation),
            ")",
        );
    if (m.Enormal)
        retval.push("Enormal", "(", ...formatEnormal(m.Enormal), ")");
    if (m.ToCurrentEnormal)
        retval.push(
            "ToCurrentEnormal",
            "(",
            ...formatEnormal(m.ToCurrentEnormal),
            ")",
        );
    if (m.PhuMob) {
        if (m.PhuMob === true) retval.push("PhuMob");
        else retval.push(`PhuMob(${m.PhuMob})`);
    }
    if (m.CarrierCarrierScattering) {
        if (m.CarrierCarrierScattering === true)
            retval.push("CarrierCarrierScattering");
        else
            retval.push(
                `CarrierCarrierScattering(${m.CarrierCarrierScattering})`,
            );
    }
    if (m.ConstantMobility !== undefined)
        retval.push((m.ConstantMobility ? "+" : "-") + "ConstantMobility");
    if (m.Diffusivity) retval.push();
    if (m.Diffusivity)
        retval.push(
            "Diffusivity",
            "(",
            ...formatHighFieldSaturation(m.Diffusivity),
            ")",
        );
    if (m.eDiffusivity)
        retval.push(
            "eDiffusivity",
            "(",
            ...formatHighFieldSaturation(m.eDiffusivity),
            ")",
        );
    if (m.hDiffusivity)
        retval.push(
            "hDiffusivity",
            "(",
            ...formatHighFieldSaturation(m.hDiffusivity),
            ")",
        );
    if (m.IncompleteIonization) retval.push("IncompleteIonization");
    if (m.MultiValley) retval.push("MultiValley");
    if (m.Tunneling !== undefined)
        retval.push((m.Tunneling ? "+" : "-") + "Tunneling");
    return retval;
};

type DopingDependence = {
    Arora?: true;
    BalMob?: { Lch: number } | true;
    Masetti?: true;
    PhuMob?: true;
    PhuMob2?: true;
    UniBo?: true;
};

const formatDopingDependence = (raw: DopingDependence) => {
    const { BalMob, ...others } = raw;
    let retval = Object.keys(others);
    if (BalMob) {
        if (BalMob === true) retval.push("BalMob");
        else retval.push(`BalMob(Lch=${BalMob.Lch})`);
    }
    return retval;
};

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

const formatHighFieldSaturation = (raw: HighFieldSaturation) => {
    const ret: string[] = [];
    if (raw.DrivingForce) ret.push(raw.DrivingForce);
    if (raw.model) ret.push(raw.model);
    return ret;
};

type EnormalIALMob = {
    AutoOrientation?: boolean;
    ClusteringEverywhere?: boolean;
    FullPhuMob?: boolean;
    ParameterSetName?: string;
    PhononCombination?: 0 | 1 | 2;
};

const formatEnormalIALMob = (raw: EnormalIALMob) => {
    const ret: string[] = [];
    const { ParameterSetName, PhononCombination, ...sw } = raw;
    ret.push(...Object.entries(sw).map(([k, v]) => (v ? "+" : "-") + k));
    if (ParameterSetName) ret.push(`ParameterSetName="${ParameterSetName}"`);
    if (PhononCombination !== undefined)
        ret.push(`PhononCombination=${PhononCombination}`);
    return ret;
};

type EnormalLombardi = {
    AutoOrientation?: boolean;
    ParameterSetName?: string;
};

const formatEnormalLombardi = (raw: EnormalLombardi) => {
    const ret: string[] = [];
    const { AutoOrientation, ParameterSetName } = raw;
    const { formatSwitch } = useFormatUtils(ret);
    formatSwitch(raw, "AutoOrientation");
    if (AutoOrientation)
        ret.push((AutoOrientation ? "+" : "-") + "AutoOrientation");
    if (ParameterSetName) ret.push(`ParameterSetName="${ParameterSetName}"`);
    return ret;
};

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

const formatEnormal = (raw: Enormal) => {
    const { IALMob, Lombardi, ...flags } = raw;

    const retval = Object.keys(flags);
    if (IALMob)
        retval.push(`IALMob( ${formatEnormalIALMob(IALMob).join(" ")} )`);
    if (Lombardi)
        retval.push(`Lombardi( ${formatEnormalLombardi(Lombardi).join(" ")} )`);
    return retval;
};

export { formatMobility };
export type { Mobility };
