module.exports = function (SOCIALBROWSER) {
  if (document.location.href.contains('jawaker.com')) {
    SOCIALBROWSER.onLoad(() => {
      SOCIALBROWSER.addJS(SOCIALBROWSER.readFile(__dirname + '/jawaker.js'));
      SOCIALBROWSER.addHTML(SOCIALBROWSER.readFile(__dirname + '/jawaker.html'));
    });
  }
};
