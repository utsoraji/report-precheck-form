const APPROVAL_LOG_COLUMN = {
  RESPONSE_ID: 0,
  STUDENT_MAIL:1,
  STUDENT_ID: 2,
  STUDENT_NAME: 3,
  DECLARANT: 4,
  APPROVAL: 5,
  TIMESTAMP: 6,
}
Object.freeze(APPROVAL_LOG_COLUMN)

/**
 * 指定されたレスポンスIDに基づき、申告内容を承認ログに書き込みます。
 * 
 * @param {string} responseId - ログに記録するレスポンスID。
 * @param {string} approval - ログに記録する申告内容。
 */
function writeApprovalLog(responseId, approval) {
  // 承認ログ用シートを取得
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.APPROVAL_LOG);

  // レスポンスIDに基づいてレコードを取得
  const record = getResponseRecord(responseId);

  const afterLastRow = sheet.getLastRow() + 1;
  // 学籍番号を文字列として扱う
  sheet.getRange(afterLastRow, 1, 1, 5).setNumberFormat('@STRING@');
  sheet.getRange(afterLastRow, 1, 1, 7).setValues([[
    responseId,  // レスポンスID
    record.studentMail,  // 学生のメールアドレス
    record.studentIdNo,  // 学生のID番号
    record.studentName,  // 学生の氏名
    record.assignedProfessor,  // 割り当てられた教授
    approval,  // 認否
    new Date(),  // タイムスタンプ
  ]]);
}

function findApprovalLog(responseId) {
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.APPROVAL_LOG);
  
  row = findRowWith(sheet, APPROVAL_LOG_COLUMN.RESPONSE_ID, responseId)
  
  if (row) {
    return {
      responseId: responseId,
      approval: row[APPROVAL_LOG_COLUMN.APPROVAL],
      timestamp: row[APPROVAL_LOG_COLUMN.TIMESTAMP]
    }
  } else {
    return null
  }
}

function test_writeApprovalLog() {
  writeApprovalLog("2_ABaOnudz5IALpxGpt4GX0RvgQJB4cq8eia5oKhmPRE1pESsvQKEmAU4EYXeciq9Jrh0iU2w","accept")

}

function test_findApprovalLog() {
  findApprovalLog("2_ABaOnudz5IALpxGpt4GX0RvgQJB4cq8eia5oKhmPRE1pESsvQKEmAU4EYXeciq9Jrh0iU2w")
}