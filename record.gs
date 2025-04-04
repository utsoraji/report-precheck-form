/**
 * Form Item ID
 * フォームの質問項目に自動設定されるID
 */
const IID = {
  STUDENT_ID_NO: 828242977,
  STUDENT_NAME: 1365518766,
  ASSIGNED_PROFESSOR: 1973224472,
  REPORT_FILES: 890845907,
  NOTE: 184656729,
}
Object.freeze(IID)

function createEmptyRecord() {
  return {
    responseId: '',
    studentMail: '',
    studentIdNo: '',
    studentName: '',
    assignedProfessor: '',
    reportFiles: [],
    note: '',
    createdAt: '',
  }
}


function createDummyRecord() {
  return {
    responseId: 'xxxxx',
    studentMail: 'xx@xx.ac.jp',
    studentIdNo: '00001234',
    studentName: 'xx',
    assignedProfessor: '小竹 真佐子',
    reportFiles: ['xx'],
    note: 'xx',
    createdAt: new Date(),
  }
}

// [{title=学生証番号／Student Id Number, id=828242977}, {title=学生氏名／Student Name, id=1365518766}, {id=1973224472, title=配属先教員／The professor whom she/he is assigned}, {title=承認依頼レポート／Approval Request Report, id=890845907}, {id=184656729, title=連絡欄（何かあれば補記ください）／Contact section (please add any additional information)}]
/**
 * フォームのレスポンスを元にレコードオブジェクトを生成します。
 * 
 * @param {GoogleAppsScript.Forms.FormResponse} response - Googleフォームからのレスポンスオブジェクト。
 * @returns {Object} レコードオブジェクト。以下のプロパティを含みます。
 *  - {string} responseId - フォームレスポンスのID。
 *  - {string} studentMail - 学生のメールアドレス。
 *  - {Date} createdAt - レスポンスのタイムスタンプ。
 *  - {string} studentIdNo - 学生のID番号。
 *  - {string} studentName - 学生の名前。
 *  - {string} assignedProfessor - 割り当てられた教授。
 *  - {Array} reportFiles - 添付されたレポートファイル情報の配列。
 *  - {string} note - 連絡欄に入力された内容。
 * 
 * @throws {Error} 要素数の不一致が発生した場合にエラーをスローします。
 */
function convertResponseToRecord(response) {
  // 空のレコードオブジェクトを作成
  const ret = createEmptyRecord();

  // 初期の要素数を記録
  const elemCount = Object.keys(ret).length;

  // レスポンスID、メール、タイムスタンプを設定
  ret.responseId = response.getId();
  ret.studentMail = response.getRespondentEmail();
  ret.createdAt = response.getTimestamp();

  // 各アイテムレスポンスを処理
  for (const iRes of response.getItemResponses())  {
    const itemId = iRes.getItem().getId();
    
    // 各質問項目のIDに応じた処理
    switch(itemId) {
      case IID.STUDENT_ID_NO:  // 学生のID番号
        ret.studentIdNo = iRes.getResponse();
        break;
      case IID.STUDENT_NAME:  // 学生の名前
        ret.studentName = iRes.getResponse();
        break;
      case IID.ASSIGNED_PROFESSOR:  // 割り当てられた教授
        ret.assignedProfessor = iRes.getResponse();
        break;
      case IID.REPORT_FILES:  // 添付ファイル
        for(const fileId of iRes.getResponse()) {
          const file = DriveApp.getFileById(fileId);
          ret.reportFiles.push({
            id: fileId,  // ファイルID
            name: file.getName(),  // ファイル名
          });
        }
        break;
      case IID.NOTE:  // 連絡欄
        ret.note = iRes.getResponse();
        break;
    }
  }

  // レコードの要素数が変わっていないかチェック
  if (elemCount != Object.keys(ret).length) throw Error("Element Count Missmatch");

  // 完成したレコードを返す
  return ret;
}
