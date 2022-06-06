module.exports = function (SOCIALBROWSER) {
    SOCIALBROWSER.menu_list.push({
        label: 'Open Akwam Site Manager',
        click: () => {
            SOCIALBROWSER.call('[send-render-message]', {
                name: '[open new popup]',
                url: 'http://127.0.0.1:60080/extentions/akwam/manager',
                partition: SOCIALBROWSER.partition,
                show: true,
                trusted: true,
            });
        },
    });
    SOCIALBROWSER.menu_list.push({ type: 'separator' });
};
