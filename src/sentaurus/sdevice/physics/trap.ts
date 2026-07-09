import useFormatUtils from "../format-utils";

type EnergeticDistribution = {
    base: "fromCondBand" | "fromMidBandGap" | "fromValBand";
} & (DistLevel | DistUniform | DistExp | DistGauss | DistTable);

const formatEnergeticDistribution = (e: EnergeticDistribution) => {
    const retval: string[] = [];
    const p = (...items: string[]) => retval.push(...items);
    p(e.base);
    const { formatAssignment } = useFormatUtils(retval);
    switch (e.kind) {
        case "Level":
            p(e.kind);
            formatAssignment(e, "EnergyMid");
            break;
        case "Uniform":
        case "Exponential":
        case "Gaussian":
            p(e.kind);
            formatAssignment(e, "EnergyMid");
            formatAssignment(e, "EnergySig");
            break;
        case "Table":
            p(
                `Table=(${e.table
                    .map(({ level, conc }) => [level, conc])
                    .flat()
                    .join(" ")})`,
            );
            break;
    }
    return retval;
};

type DistLevel = {
    kind: "Level";
    EnergyMid: number;
};

type DistUniform = {
    kind: "Uniform";
    EnergyMid: number;
    EnergySig: number;
};

type DistExp = {
    kind: "Exponential";
    EnergyMid: number;
    EnergySig: number;
};

type DistGauss = {
    kind: "Gaussian";
    EnergyMid: number;
    EnergySig: number;
};

type DistTable = {
    kind: "Table";
    table: { level: number; conc: number }[];
};

type SpatialDistribution = {
    SpatialShape: "Uniform" | "Gaussian";
    SpaceMid: [number, number, number];
    SpaceSig: [number, number, number];
};

const formatSpatialDistribution = (s: SpatialDistribution) => {
    let retval: string[] = [s.SpatialShape];
    retval.push(`SpaceMid=(${s.SpaceMid.join(" ")})`);
    retval.push(`SpaceSig=(${s.SpaceSig.join(" ")})`);
    return retval;
};

type Trap<T extends "Bulk" | "Interface", M extends string> = {
    Name?: string;
    type: "FixedCharge" | "Acceptor" | "Donor" | "eNeutral" | "hNeutral";
    energeticDistribution: EnergeticDistribution;
    spatialDistribution?: SpatialDistribution;
    Conc: number;
    eXsection?: number;
    hXsection?: number;
    Material?: T extends "Interface" ? M : never;
    Region?: T extends "Interface" ? string : never;
};

const formatTrap = <T extends "Bulk" | "Interface", M extends string>(
    t: Trap<T, M>,
) => {
    let retval: string[] = [t.type];
    const { formatAssignment } = useFormatUtils(retval);
    formatAssignment(t, "Name", (k, v) => `${k}="${v}"`);
    formatAssignment(t, "Conc");
    formatAssignment(t, "eXsection");
    formatAssignment(t, "hXsection");
    formatAssignment(t, "Material" as any);
    formatAssignment(t, "Region" as any);
    retval.push(...formatEnergeticDistribution(t.energeticDistribution));
    if (t.spatialDistribution !== undefined)
        retval.push(...formatSpatialDistribution(t.spatialDistribution));
    return retval;
};

export { formatTrap };
export type { Trap };
