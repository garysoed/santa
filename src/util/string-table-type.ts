import { ArrayOfType, StringType, Type } from '@gs-types';

export const STRING_TABLE_TYPE: Type<ReadonlyArray<readonly string[]>> =
    ArrayOfType(ArrayOfType(StringType));
