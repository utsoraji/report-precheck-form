const SUBMITTED_LIST_COLUMN = {
  RESPONSE_ID: 0,
  STUDENT_MAIL:1,
  STUDENT_IDNO: 2,
  STUDENT_NAME: 3,
  ASSIGNED_PROFESSOR: 4,
  FILE: 5,
  CREATED_AT: 6,
  APPROVAL: 7,
  APPROVED_AT: 8,
  REMINDED_AT: 9,
  EXPIRED_AT: 10,
}
Object.freeze(SUBMITTED_LIST_COLUMN)


/**
 * 指定されたレコードを待機リストに追加します。
 * 
 * @param {Object} record - 追加するレコードオブジェクト。以下のプロパティを含みます。
 *  - {string} responseId - レスポンスID。
 *  - {string} studentMail - 学生のメールアドレス。
 *  - {string} studentIdNo - 学生のID番号。
 *  - {string} studentName - 学生の名前。
 *  - {string} assignedProfessor - 割り当てられた教授の名前。
 *  - {Array} reportFiles - 提出されたレポートファイルの配列（最初のファイルのみ使用）。
 *  - {Date} createdAt - レコードが作成された日付。
 */
function addToSubmittedList(record) {
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.SUBMITTED_LIST);

  const dataRow = [
    record.responseId,
    record.studentMail,
    record.studentIdNo,
    record.studentName,
    record.assignedProfessor,
    getDriveLink(record.reportFiles[0].id),  // 最初のレポートファイルのみ追加
    record.createdAt,
    "notyet",
    "", // 空文字列は未使用のフィールド用
    "",
    "",
  ]

  const headerCount = 1
  sheet.insertRowAfter(headerCount)
  sheet.getRange(headerCount + 1, 1, 1, 5).setNumberFormat('@STRING@');
  sheet.getRange(headerCount + 1, 1, 1, dataRow.length).setValues([dataRow])
}

/**
 * 指定されたレスポンスIDのレコードに対して、承認情報を設定します。
 * 承認フラグと承認日時をシートに記録します。
 * 
 * @param {string} responseId - 承認を設定するレスポンスID。
 * @param {string} approve - 承認内容。"accepted"の場合は承認、"rejected"の場合は非承認を意味します。
 */
function setApproveToSubmittedList(responseId, approve) {
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.SUBMITTED_LIST);
  const list = getDataRows(sheet);

  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    if (row[SUBMITTED_LIST_COLUMN.RESPONSE_ID] === responseId) {
      // 承認フラグと承認日時を設定
      sheet.getRange(i + 2, SUBMITTED_LIST_COLUMN.APPROVAL + 1).setValue(approve);
      sheet.getRange(i + 2, SUBMITTED_LIST_COLUMN.APPROVED_AT + 1).setValue(new Date());
    }
  }
}

function getApproveState(responseId) {
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.SUBMITTED_LIST);
  const list = getDataRows(sheet);

  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    if (row[SUBMITTED_LIST_COLUMN.RESPONSE_ID] === responseId) {
      return sheet.getRange(i + 2, SUBMITTED_LIST_COLUMN.APPROVAL + 1).getValue()
    }
  }
}

/**
 * 提出から{REMIND_LIMIT_DAYS}日経ったレコードを検索し、リマインド日を設定して返します。
 * リマインドされていないレコードのみが対象となります。
 * 
 * @returns {Array} リマインド対象のレスポンスIDの配列。
 */
function findRecordToRemindAndMarkAsReminded() {
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.SUBMITTED_LIST);
  const list = getDataRows(sheet);
  const ret = [];

  const now = new Date();

  for (let i = 0; i < list.length; i++) {
    if (list[i][SUBMITTED_LIST_COLUMN.APPROVED_AT]) continue; // 認否確認済みは無視

    const deadline = list[i][SUBMITTED_LIST_COLUMN.CREATED_AT];
    if(!deadline) continue; // 申請日時が取れなければ無視
    
    deadline.setDate(deadline.getDate() + REMIND_LIMIT_DAYS);
    
    // 提出から3日経ち、まだリマインドされていないレコードを検索
    if (deadline <= now && !list[i][SUBMITTED_LIST_COLUMN.REMINDED_AT]) {
      // リマインド日を設定
      sheet.getRange(i + 2, SUBMITTED_LIST_COLUMN.REMINDED_AT + 1).setValue(deadline);
      ret.push(list[i][SUBMITTED_LIST_COLUMN.RESPONSE_ID]);
    }
  }

  return ret; // リマインド対象のレスポンスIDを返す
}

/**
 * 提出から{EXPIRED_LIMIT_DAYS}日経ったレコードを検索し、期限切れ日を設定して返します。
 * まだ期限切れとされていないレコードのみが対象となります。
 * 
 * @returns {Array} 期限切れ対象のレスポンスIDの配列。
 */
function findRecordToExpireAndMarkAsExpired() {
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.SUBMITTED_LIST);
  const list = getDataRows(sheet);
  const ret = [];

  const now = new Date();

  for (let i = 0; i < list.length; i++) {
    if (list[i][SUBMITTED_LIST_COLUMN.APPROVED_AT]) continue; // 認否確認済みは無視

    const deadline = list[i][SUBMITTED_LIST_COLUMN.CREATED_AT];
    if(!deadline) continue; // 申請日時が取れなければ無視

    deadline.setDate(deadline.getDate() + EXPIRED_LIMIT_DAYS);
    
    // 提出から7日経ち、まだ期限切れになっていないレコードを検索
    if (deadline <= now && !list[i][SUBMITTED_LIST_COLUMN.EXPIRED_AT]) {
      // 期限切れ日を設定
      sheet.getRange(i + 2, SUBMITTED_LIST_COLUMN.EXPIRED_AT + 1).setValue(deadline);
      ret.push(list[i][SUBMITTED_LIST_COLUMN.RESPONSE_ID]);
    }
  }

  return ret; // 期限切れ対象のレスポンスIDを返す
}

function test_findRecord() {
  Logger.log(findRecordToRemindAndMarkAsReminded())
  Logger.log(findRecordToExpireAndMarkAsExpired())
}