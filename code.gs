// スプレッドシートID
const SHEET_ID = "1Q0pg6eAHF3rDCVRWgyzHMqBytsFwgapjMLGoFPr82u4"
// リマインド期日
const REMIND_LIMIT_DAYS = 3
// 期限切れ期日
const EXPIRED_LIMIT_DAYS = 7

// 自動メール送信者名
const MAIL_SENDER_NAME = "輪講レポート受付"
// 自動メール件名の先頭に追加する文字列
const MAIL_SUBJECT_PREFIX = "【輪講レポート受付】"
// 自動メールのCC宛先アドレス（カンマ区切り）
const OFFICE_CC_MAIL = ""
// メール送信失敗通知メールの宛先アドレス（カンマ区切り）
const MAIL_ERROR_NOTICE_MAIL = "soraji@fract.t.u-tokyo.ac.jp"
const PAGE_TITLE="TITLE"

/**
 * Formからの提出時に実行する
 */
function onSubmit(e) {
  const record = convertResponseToRecord(e.response)
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000)
    // 担当教員へ通知する
    noticeToAssignedProfessor(record)
    // 承認待ちアイテムに追加
    addToSubmittedList(record)
  } finally {
    lock.releaseLock()
  }
}

/**
 * 1日1回以上実行する。
 * 承認判断ないまま一定期間経過したものについて、所定の処理を行う。
 */
function triggerRemindAndExpired() {
  const lock = LockService.getScriptLock();

  // 担当教員にリマインドする
  try {
    lock.waitLock(20000)
    const toRemind = findRecordToRemindAndMarkAsReminded()
    for (const id of toRemind) {
      remindToAssigedProfessor(getResponseRecord(id))
    }
  } finally {
    lock.releaseLock()
  }

  // 学生に通知する
  try {
    lock.waitLock(20000)
    const toExpire = findRecordToExpireAndMarkAsExpired()
    for (const id of toExpire) {
      noticeStudentsToExpire(getResponseRecord(id))
    }
  } finally {
    lock.releaseLock()
  }

}


/**
 * Webアプリとして機能し、提出物の詳細を表示する。
 * 担当教員は認否の判断を（まだしていなければ）行える。
 */
function doGet(e) {
  Logger.log(e);

  const id = e.parameter.id
  if(!id) return show404()

  return showResponsePage(id)

}

/**
 * Webアプリとして機能し、担当教員の認否の判断を記録し、提出物の詳細を表示する。
 */
function doPost(e) {
  Logger.log(e);

  const id = e.parameter.id
  if(!id) return show404()

  const approval = e.parameter.approval
  if(approval) {
    receiveApproval(id, approval)
  }

  return showResponsePage(id)
}

/**
 * 担当教員からのレスポンス受取時に実行する
 * コメントについては提出されたファイルに直接付ける想定
 */
function receiveApproval(responseId, approval) {
  // 担当教員でなければ無視
  const professor = findAccessUser()
  if (!professor) return
  const record = getResponseRecord(responseId)
  if (!record || record.assignedProfessor != professor.name) return

  const lock = LockService.getScriptLock(); 
  try {
    lock.waitLock(5000)
    // 承認ログに記録
    writeApprovalLog(responseId, approval)
    // 提出リストに記録
    setApproveToSubmittedList(responseId, approval)

    if (approval === "reject") {
      noticeStudentsToRejected(record)
    } else if (approval === "accept") {
      noticeStudentsToAccepted(record)
    }
  } finally {
    lock.releaseLock()
  }
}

function getDriveLink(fileId) {
  return "https://drive.google.com/file/d/" + fileId + "/view?usp=drive_link"
}

function test_receiveApproval() {
  receiveApproval("2_ABaOnufZE4IuHpBEmxYOAQgFeRwHT2PqYh00WxNXzFCQ-rm3L41IXcWGINUt8zj2hnTatBs","accept")
}