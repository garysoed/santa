import * as columnify from 'columnify';
import * as commandLineUsage from 'command-line-usage';
import * as process from 'process';

import { Value } from '../../component/entry';
import { LogLevel } from '../../component/log-level';
import { getSymbol } from '../get-symbol';
import { STRING_TABLE_TYPE } from '../string-table-type';

import { colorize } from './colorize';


interface RenderedRow {
  readonly prefix: string;
  [key: number]: string;
}

function formatRows(rows: ReadonlyArray<readonly string[]>, type: LogLevel): string {
  const renderedRows: RenderedRow[] = [];
  const cellMaxLengths: number[] = [];
  for (const cells of rows) {
    const renderedRow: RenderedRow = {prefix: `[${getSymbol(type)}]`};
    for (let c = 0; c < cells.length; c++) {
      const cell = cells[c];
      const maxLength = cellMaxLengths[c] || 0;
      cellMaxLengths[c] = Math.max(maxLength, cell.length);
      renderedRow[c] = cells[c];
    }
    renderedRows.push(renderedRow);
  }

  const maxCols = rows.map(row => row.length).reduce((max, current) => Math.max(max, current), 0);
  const numberColumns = [];
  for (let i = 0; i < maxCols; i++) {
    numberColumns.push(`${i}`);
  }

  // Compute the maxWidths by: cellMaxLength / totalCellMaxLength * (cliWidth - 4)
  const totalCellMaxLength = cellMaxLengths.reduce((sum, current) => sum + current, 0);
  const cliWidth = process.stdout.columns - 4;
  const config: Record<number, columnify.Options> = {};
  for (let i = 0; i < cellMaxLengths.length; i++) {
    config[i] = {maxWidth: Math.floor(cellMaxLengths[i] / totalCellMaxLength * cliWidth)};
  }

  return colorize(
      type,
      columnify(
          renderedRows,
          {
            columns: ['prefix', ...numberColumns],
            config,
            preserveNewLines: true,
            showHeaders: false,
          }),
  );
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
