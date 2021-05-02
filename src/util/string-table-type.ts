import {arrayOfType, stringType, Type} from 'gs-types';

export const STRING_TABLE_TYPE: Type<ReadonlyArray<readonly string[]>> =
    arrayOfType(arrayOfType(stringType));
