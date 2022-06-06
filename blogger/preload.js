module.exports = function (SOCIALBROWSER) {
    let exists = false;
    SOCIALBROWSER.menu_list.forEach((m) => {
        if (m.label == 'Open Blogger Manager') {
            exists = true;
        }
    });
    if (!exists) {
        SOCIALBROWSER.menu_list.push({
            label: 'Open Blogger Manager',
            click: () => {
                SOCIALBROWSER.call('[send-render-message]', {
                    name: '[open new popup]',
                    url: 'http://127.0.0.1:60080/extentions/blogger/manager',
                    partition: SOCIALBROWSER.partition,
                    show: true,
                    trusted: true,
                });
            },
        });
        SOCIALBROWSER.menu_list.push({ type: 'separator' });
    }
};
