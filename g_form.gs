function getForm() {
  return FormApp.getActiveForm()
}

function getResponses() {
   return getForm().getResponses()
}

function getResponseRecord(id) {
  return convertResponseToRecord(getForm().getResponse(id))
}

function dev_showResponseIds() {
  for(const res of getResponses()) {
    Logger.log(res.getId())
    Logger.log(res.getEditResponseUrl())
  }
}

function dev_showItemIDs() {
  const items = getForm().getItems()
  Logger.log(items.map((i) => ({ title:i.getTitle(), id: Utilities.formatString('%d',i.getId())})))
}


