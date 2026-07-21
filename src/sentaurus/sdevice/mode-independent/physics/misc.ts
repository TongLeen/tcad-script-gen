type Aniso = {
    direction?: {
        axis: "xAxis" | "yAxis" | "zAxis" | [number, number, number];
        coord: "Crystal" | "System";
    };
    Avalanche?: true;
    eAvalanche?: true;
    hAvalanche?: true;

    Mobility?: true;
    eMobility?: true;
    hMobility?: true;
    eMobilityFactor?: number;
    hMobilityFactor?: number;

    Poisson?: true;
    Temperature?: true;

    eQuantumPotential?: true;
    hQuantumPotential?: true;

    MetalResistivity?: true;
};

const formatAniso = (raw: Aniso) => {
    const { direction, eMobilityFactor, hMobilityFactor, ...flags } = raw;

    const ret = Object.keys(flags);
    if (direction) {
        const { axis, coord } = direction;
        const k = coord === "Crystal" ? "direction" : "direction(System_Coord)";
        if (typeof axis === "string") ret.push(`${k}=${axis}`);
        else ret.push(`${k}=(${axis.join(" ")})`);
    }
    if (eMobilityFactor) ret.push(`eMobilityFactor(Total)=${eMobilityFactor}`);
    if (hMobilityFactor) ret.push(`hMobilityFactor(Total)=${hMobilityFactor}`);
    return ret;
};

type BarrierTunneling = {
    Band2Band?: "None" | "Full" | "Simple" | "UpsideDown";
    BandGap?: boolean;
    BarrierLowering?: boolean;
    ModifiedWKB?: boolean;
    Multivalley?: boolean;
    PeltierHeat?: boolean;
    Schroedinger?: boolean;
    Transmission?: boolean;
    TwoBand?: boolean;
};

const formatBarrierTunneling = (raw: BarrierTunneling) => {
    const { Band2Band, ...sw } = raw;

    const ret: string[] = [];
    if (Band2Band) ret.push(`Band2Band=${Band2Band}`);
    ret.push(...Object.entries(sw).map(([k, v]) => (v ? "+" : "-") + k));
    return ret;
};

type EffectiveIntrinsicDensity = {
    BandGapNarrowing?:
        | true
        | "BennettWilson"
        | "delAlamo"
        | "JainRoulston"
        | "oldSlotboom"
        | "Slotboom"
        | "TableBGN";
    NoBandGapNarrowing?: true;
    NoFermi?: true;
};

const formatEffectiveIntrinsicDensity = (raw: EffectiveIntrinsicDensity) => {
    const { BandGapNarrowing, ...flags } = raw;

    const ret = Object.keys(flags);
    if (BandGapNarrowing) {
        if (BandGapNarrowing === true) ret.push("BandGapNarrowing");
        else ret.push(`BandGapNarrowing(${BandGapNarrowing})`);
    }
    return ret;
};

type IncompleteIonization<D extends string = string> = {
    Dopants?: D[];
    Split?: {
        Doping: D;
        Weight: number[];
    };
};

const formatIncompleteIonization = (raw: IncompleteIonization) => {
    const ret: string[] = [];
    const { Dopants, Split } = raw;
    if (Dopants) {
        ret.push(`Dopants="${Dopants.join(" ")}"`);
    }
    if (Split) {
        ret.push(
            `Doping="${Split.Doping}"`,
            `Weights=(${Split.Weight.join(" ")})`,
        );
    }
    return ret;
};

export {
    formatAniso,
    formatBarrierTunneling,
    formatEffectiveIntrinsicDensity,
    formatIncompleteIonization,
};

export type {
    Aniso,
    BarrierTunneling,
    EffectiveIntrinsicDensity,
    IncompleteIonization,
};
