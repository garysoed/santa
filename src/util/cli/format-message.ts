import * as process from 'process';

import columnify from 'columnify';

import {LogLevel} from '../../component/log-level';
import {getSymbol} from '../get-symbol';

import {colorize} from './colorize';


interface Options {
  readonly key: string|null;
  readonly showPrefix: boolean;
}

interface RenderedRow {
  readonly symbol: string;
  readonly key: string|null;
  [key: number]: string;
}

function formatRows(
    rows: ReadonlyArray<readonly string[]>,
    type: LogLevel,
    showPrefix: boolean,
    key: string|null,
): string {
  const renderedRows: RenderedRow[] = [];
  const cellMaxLengths: number[] = [];
  for (const cells of rows) {
    const renderedRow: RenderedRow = {
      symbol: `[${getSymbol(type)}]`,
      key: `[${key}]`,
    };
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

  const prefixColumn = [];
  if (showPrefix) {
    prefixColumn.push('symbol');
  }

  if (key) {
    prefixColumn.push('key');
  }

  return colorize(
      type,
      columnify(
          renderedRows,
          {
            columns: [...prefixColumn, ...numberColumns],
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
export function formatMessage(
    type: LogLevel,
    message: ReadonlyArray<readonly string[]>,
    options: Options,
): string {
  return formatRows(
      message,
      type,
      options.showPrefix,
      options.key,
  );
}
