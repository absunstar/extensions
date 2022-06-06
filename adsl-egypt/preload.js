module.exports = function (SOCIALBROWSER) {
    if (document.location.href.like('*phones*')) {
        SOCIALBROWSER.menuOFF = false;
    }

    SOCIALBROWSER.addMenu({
        label: ' === > ( Open Adsl Egypt Manager )',
        click: () => {
            SOCIALBROWSER.openWindow({ show: true, url: 'http://127.0.0.1:60080/phones', partition: 'phones', maximize: true });
        },
    });
};
