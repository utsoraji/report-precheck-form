function noticeToAssignedProfessor(record) {
  const subject = `レポートが提出されました`
  const body = `レポートが提出されました。
以下のリンクから確認をお願いします。

詳細：
${generateLink(record.responseId)}

ファイル：
${getDriveLink(record.reportFiles[0].id)}

`
  professor = findAddress(record.assignedProfessor)
  sendEmail(
    professor.mail,
    OFFICE_CC_MAIL,
    subject,
    body
  )
}

function remindToAssigedProfessor(record) {
  const subject = `レポートが提出されました（リマインド）`
  const body = `レポートが提出されました。
以下のリンクから確認をお願いします。

詳細：
${generateLink(record.responseId)}

ファイル：
${getDriveLink(record.reportFiles[0].id)}

`
  professor = findAddress(record.assignedProfessor)
  sendEmail(
    professor.mail,
    OFFICE_CC_MAIL,
    subject,
    body
  )
}

function noticeStudentsToExpire(record) {
  const subject = `レポートが受付られませんでした`
  const body = `レポート提出から${EXPIRED_LIMIT_DAYS}日経ちましたが、担当教員による承認がありません。
担当教員に確認するか、再提出してください。

詳細：
${generateLink(record.responseId)}

ファイル：
${getDriveLink(record.reportFiles[0].id)}

`
  sendEmail(
    record.studentMail,
    OFFICE_CC_MAIL,
    subject,
    body
  )
}

function noticeStudentsToAccepted(record) {
  const subject = `レポートがアクセプトされました`
  const body = `レポートがアクセプトされました。

詳細：
${generateLink(record.responseId)}

ファイル：
${getDriveLink(record.reportFiles[0].id)}

`
  sendEmail(
    record.studentMail,
    OFFICE_CC_MAIL,
    subject,
    body
  )
}


function noticeStudentsToRejected(record) {
  const subject = `レポートがリジェクトされました`
  const body = `レポートがリジェクトされました。
担当教員の指摘を確認し、再提出してください。

詳細：
${generateLink(record.responseId)}

ファイル：
${getDriveLink(record.reportFiles[0].id)}

`
  sendEmail(
    record.studentMail,
    OFFICE_CC_MAIL,
    subject,
    body
  )
}


/**
 * メール送信処理共通化。
 * @param {string} recipient
 * @param {string | string[]} cc
 * @param {string} subject
 * @param {string} body
 */
function sendEmail(recipient, cc, subject, body) {
  ccStr = Array.isArray(cc) ? cc.join(','): cc ?? ''

  const option = {
    name: MAIL_SENDER_NAME,
    cc: ccStr
  }

  try {
    GmailApp.sendEmail(
      recipient,
      MAIL_SUBJECT_PREFIX + subject,
      body,
      option)
  } catch(e) { // 送信失敗をメール通知する
    const errorMsg = `メール送信に失敗しました
ERROR: ${e.message}

MAIL: ${recipient}

CC: ${cc}

SUBJECT: ${subject}
`
    GmailApp.sendEmail(
      MAIL_ERROR_NOTICE_MAIL,
      MAIL_SUBJECT_PREFIX + 'メール送信失敗通知',
      errorMsg)
    throw e
  }
}