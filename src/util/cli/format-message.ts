import columnify from 'columnify';
import commandLineUsage from 'command-line-usage';

import { Value } from '../../component/entry';
import { LogLevel } from '../../component/log-level';
import { getSymbol } from '../get-symbol';
import { STRING_TABLE_TYPE } from '../string-table-type';


interface RenderedRow {
  readonly prefix: string;
  [key: number]: string;
}

function formatRows(rows: ReadonlyArray<readonly string[]>, type: LogLevel): string {
  const renderedRows: RenderedRow[] = [];
  for (const cells of rows) {
    const renderedRow: RenderedRow = {prefix: `[${getSymbol(type)}]`};
    for (let c = 0; c < cells.length; c++) {
      renderedRow[c] = cells[c];
    }
    renderedRows.push(renderedRow);
  }

  const maxCols = rows.map(row => row.length).reduce((max, current) => Math.max(max, current), 0);
  const numberColumns = [];
  for (let i = 0; i < maxCols; i++) {
    numberColumns.push(`${i}`);
  }

  return columnify(renderedRows, {showHeaders: false, columns: ['prefix', ...numberColumns]});
}


/**
 * Formats message to be shown on the CLI.
 *
 * If the message is a table of strings, format the string as columns, each with a prefix.
 * If the * message is an array of commandLineUsage Sections, they will be passed to
 * commandLineUsage with the appended prefix.
 */
export function formatMessage(type: LogLevel, message: Value): string {
  if (STRING_TABLE_TYPE.check(message)) {
    return formatRows(message, type);
  }

  return commandLineUsage(message);
}
