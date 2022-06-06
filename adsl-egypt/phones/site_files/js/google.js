SOCIALBROWSER.onLoad(() => {
    if (document.location.hostname.like('*google.com*')) {
        var __triggerMouseEvent = function (node, eventType) {
            try {
                if (document.createEvent) {
                    var clickEvent = document.createEvent('MouseEvents');
                    clickEvent.initEvent(eventType, true, true);
                    node.dispatchEvent(clickEvent);
                } else {
                    document.documentElement['MouseEvents']++;
                }
            } catch (err) {}
        };

        let info = {
            keyword: 'شبكة مصر site:egytag.com',
            hostname: 'egytag.com',
        };
        if (document.location.href.like('*url*')) {
            alert('URL Page ...');
            let founded = false;
            document.querySelectorAll('a[href]').forEach((a) => {
                if (!founded) {
                    a.scrollIntoView();
                    if (a.href.contains(info.hostname)) {
                        founded = true;
                        a.style.backgroundColor = '#030303';
                        a.style.color = '#ffffff';
                        a.style.fontSize = '22px';
                        a.click();
                    }
                }
            });
        } else if (document.location.href.like('*search*')) {
            alert('Search Page ...');
            let founded = false;
            document.querySelectorAll('a[href]').forEach((a) => {
                if (!founded) {
                    a.scrollIntoView();
                    let url = new URL(SOCIALBROWSER.handleURL(a.href));
                    if (url.hostname.contains(info.hostname)) {
                        __triggerMouseEvent(a, 'mousedown');
                        founded = true;
                        a.style.backgroundColor = '#030303';
                        a.style.color = '#ffffff';
                        a.style.fontSize = '22px';
                        let url0 = a.ping || a.getAttribute('data-cthref') || a.href;
                        alert(url0);
                        document.location.href = url0;
                    }
                }
            });
        } else {
            alert('Google Page ...');
            SOCIALBROWSER.write(info.keyword, 'input').then(() => {
                SOCIALBROWSER.click('input[type=submit]');
            });
        }
    } else {
        alert('.........................');
        SOCIALBROWSER.currentWindow.show();
        SOCIALBROWSER.on('scripts', (e, message) => {
            console.log(message);
        });
        SOCIALBROWSER.call('scripts', {
            type: 'google-search',
            done: true,
        });
    }
});
