const MASTER_PROFESSOR_COLUMN = {
  NAME: 0,
  MAIL: 1,
  GOOGLE_ACCOUNT: 2,
}
Object.freeze(MASTER_PROFESSOR_COLUMN)

/**
 * 教授の名前をもとに、アドレスリストから対応するメールアドレスやGoogleアカウントを検索します。
 * 
 * @param {string} name - 検索する教授の名前。
 * @returns {Object} 検索結果のオブジェクト。以下のプロパティを含みます。
 *  - {string} name - 教授の名前。
 *  - {string} mail - 教授のメールアドレス。
 *  - {string} google - 教授のGoogleアカウント。
 */
function findAddress(name) {
  // アドレスリストシートを取得
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.PROFESSOR_MASTER);
  
  // 指定した名前を持つ行を検索
  row = findRowWith(sheet, MASTER_PROFESSOR_COLUMN.NAME, name);
  
  // 検索結果をオブジェクトとして返す
  return {
    name: name,
    mail: row[MASTER_PROFESSOR_COLUMN.MAIL],  // メールアドレス
    google: row[MASTER_PROFESSOR_COLUMN.GOOGLE_ACCOUNT]  // Googleアカウント
  };
}

/**
 * 現在アクセス中のユーザーのGoogleアカウントに基づいて、教授の名前とメールアドレスを検索します。
 * 
 * @returns {Object} 現在のユーザー情報を含むオブジェクト。以下のプロパティを含みます。
 *  - {string} name - 教授の名前。
 *  - {string} mail - 教授のメールアドレス。
 *  - {string} google - ユーザーのGoogleアカウント（現在のアクセスユーザー）。
 */
function findAccessUser() {
  // 現在のアクセスユーザーのGoogleアカウントを取得
  const user = Session.getActiveUser().getEmail();
  
  // アドレスリストシートを取得
  const sheet = SPREAD_SHEET.getSheetByName(SHEET_NAME.PROFESSOR_MASTER);
  
  // Googleアカウントをもとに行を検索
  row = findRowWith(sheet, MASTER_PROFESSOR_COLUMN.GOOGLE_ACCOUNT, user);

  if (!row) return {}  

  // 検索結果をオブジェクトとして返す
  return {
    name: row[MASTER_PROFESSOR_COLUMN.NAME],  // 教授の名前
    mail: row[MASTER_PROFESSOR_COLUMN.MAIL],  // メールアドレス
    google: user  // 現在のユーザーのGoogleアカウント
  };
}


function testFindAddress() {
  Logger.log(findAddress("小竹 真佐子"))
}

function testFindAccessUser() {
  Logger.log(Session.getActiveUser().getEmail())
  Logger.log(findAccessUser())
}