const PRIMITIVE_FAMILIES = ['teal', 'gray', 'magenta', 'orange', 'green', 'yellow', 'amber', 'mc'];

const familyPattern = PRIMITIVE_FAMILIES.join('|');
const PRIMITIVE_NAME = new RegExp(`^--(${familyPattern})-`);
const PRIMITIVE_REFERENCE = new RegExp(`^var\\(--(${familyPattern})-`);

export const isPrimitiveToken = (name: string) => PRIMITIVE_NAME.test(name);

export const referencesPrimitive = (value: string) => PRIMITIVE_REFERENCE.test(value);
