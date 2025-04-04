/**
 * 指定されたレスポンスIDに基づいて、詳細ページを生成し、HTMLテンプレートにデータを設定して表示します。
 * ページには学生のレコード、担当教授情報、承認状態、アクションURLが含まれます。
 *
 * @param {string} responseId - 表示するレスポンスID。
 * @returns {HtmlOutput} 詳細ページのHTMLを返す。
 */
function showResponsePage(responseId) {
  // 指定されたレスポンスIDに基づいてレコードを取得
  const record = getResponseRecord(responseId);

  // 承認状態を取得
  const approveState = getApproveState(responseId);

  // 現在のアクセスユーザーを取得
  const user = findAccessUser();

  // 担当教授がユーザーと一致するか確認
  const professor = (user && user.name === record.assignedProfessor) ? user : null;

  // HTMLテンプレートにデータを埋め込む
  const t = HtmlService.createTemplateFromFile('page_show_detail.html');
  t.record = record;
  t.professor = professor;
  t.approveState = approveState;
  t.actionUrl = ScriptApp.getService().getUrl();

  // ページのタイトルを設定してHTMLを返す
  return t.evaluate().setTitle(PAGE_TITLE);
}

function test_showResponsePage() {
  showResponsePage("2_ABaOnud7Lb6cJV5o0ut6uhdHapNpfyxlYJmkQwGK93xMdjPDMCirGpHxreCgCR6QeMLd98s")
}

function show404() {
  return  HtmlService.createTemplateFromFile('page_404.html').evaluate().setTitle(`404`)
}

function generateLink(responseId) {
  return ScriptApp.getService().getUrl() + '?id=' + responseId
}