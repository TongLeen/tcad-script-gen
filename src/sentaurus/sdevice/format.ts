type FormatBatch<T extends Record<string, unknown>> = {
    flags?: (keyof T)[];
    switch?: (keyof T)[];
    assign?: (keyof T)[];
    assignString?: (keyof T)[];
    others?: { [K in keyof T]: (k: K, v: T[K]) => string[] };
};

const SDeviceFormat =
    <T extends Record<string, unknown>>(entity: T) =>
    (format: FormatBatch<T>) => {
        const retval: string[] = [];

        if (format.flags !== undefined) {
            retval.push(...(format.flags as string[]));
        }
        if (format.switch !== undefined) {
            retval.push(
                ...(format.switch as string[]).map(
                    (v) => (entity[v] ? "+" : "-") + v,
                ),
            );
        }
        if (format.assign !== undefined) {
            retval.push(
                ...(format.assign as string[]).map((v) => `${v}=${entity[v]}`),
            );
        }
        if (format.assignString !== undefined) {
            retval.push(
                ...(format.assignString as string[]).map(
                    (v) => `${v}="${entity[v]}"`,
                ),
            );
        }
        if (format.others !== undefined) {
            retval.push(
                ...Object.entries(format.others)
                    .map(([k, v]) => v(k, entity[k]))
                    .flat(),
            );
        }

        return retval;
    };

export default SDeviceFormat;
