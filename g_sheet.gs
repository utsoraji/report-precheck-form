const SHEET_NAME = {
  PROFESSOR_MASTER: '教員マスタ',
  APPROVAL_LOG: '承認ログ',
  SUBMITTED_LIST: '提出リスト',
  DEV: 'dev',
}
Object.freeze(SHEET_NAME)

const SPREAD_SHEET = SpreadsheetApp.openById(SHEET_ID); 

/**
 * 指定されたシートからデータ行を取得します。指定されたヘッダー行数を除いたデータ部分のみを返します。
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - データを取得する対象のシート。
 * @param {number} [headerCount=1] - ヘッダーの行数。デフォルトは1行です。
 * @returns {Array} シートのデータ行を配列として返します。
 */
function getDataRows(sheet, headerCount = 1) {
  return sheet.getDataRange().getValues().slice(headerCount); // ヘッダー行を除いたデータ部分を取得
}

/**
 * 指定された列IDとクエリに一致する行をシートから検索して返します。
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - 検索対象のシート。
 * @param {number} columnId - 検索対象の列番号（0から始まるインデックス）。
 * @param {string|number} query - 検索条件に使用する値。
 * @returns {Array|null} クエリに一致する行データを配列として返します。一致する行が見つからない場合は null を返します。
 */
function findRowWith(sheet, columnId, query) {
  list = getDataRows(sheet); // データ行を取得
  for (row of list) {
    if (row[columnId] === query) {
      return row; // 一致する行を返す
    }
  }
  return null; // 一致する行がない場合は null を返す
}
