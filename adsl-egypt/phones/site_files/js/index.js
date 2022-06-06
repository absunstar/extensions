app.controller('phoneNumberController', function ($scope, $http, $timeout, $interval) {
    $scope.busy = !1;
    $scope.phoneList = [];
    $scope.phoneCheckList = [];
    $scope.phone = { number: '' };
    $scope.uploadForm = {};
    $scope.checkApiReady = true;
    $scope.setting = {
        vodafone: {
            enabled: true,
            loginURL: 'https://extranet.vodafone.com.eg/dealer/#/login',
            username: 'A94592973_31',
            password: '8553bf47',
            pin: 'A94592973',
            usernameSelector: '#exampleInputEmail1',
            passwordSelector: '#exampleInputPassword1',
            pinSelector: '#exampleInputPin1',
        },
    };

    $scope.addPhone = function (phone) {
        phone = phone || $scope.phone;
        $scope.error = '';
        $scope.busy = !0;
        $http({
            method: 'POST',
            url: '/api/phones/add',
            data: {
                phone: phone,
            },
        }).then(
            function (response) {
                if (response.data.done) {
                    $scope.phoneList.push(response.data.doc);
                    $scope.phone = {};
                    site.hideModal('#newPhoneModal');
                } else if (response.data.error) {
                    $scope.error = response.data.error;
                }
                $scope.busy = !1;
            },
            function (err) {
                $scope.busy = !1;
                $scope.error = err;
            },
        );
    };
    $scope.deletePhone = function (phone) {
        phone = phone || $scope.phone;
        $scope.error = '';
        $scope.busy = !0;
        $http({
            method: 'POST',
            url: '/api/phones/delete',
            data: {
                phone: phone,
            },
        }).then(
            function (response) {
                if (response.data.done) {
                    $scope.phoneList.forEach((p, i) => {
                        if (p.id === phone.id) {
                            $scope.phoneList.splice(i, 1);
                        }
                    });
                    $scope.phone = {};
                } else if (response.data.error) {
                    $scope.error = response.data.error;
                }
                $scope.busy = !1;
            },
            function (err) {
                $scope.busy = !1;
                $scope.error = err;
            },
        );
    };
    $scope.updatePhone = function (phone) {
        phone = phone || $scope.phone;
        $scope.error = '';
        $http({
            method: 'POST',
            url: '/api/phones/update',
            data: {
                phone: phone,
            },
        }).then(
            function (response) {
                if (response.data.done) {
                    $scope.phoneList.forEach((p, i) => {
                        if (p.id === phone.id) {
                            $scope.phoneList[i] = response.data.result.doc;
                        }
                    });
                    $scope.phone = {};
                } else if (response.data.error) {
                    $scope.error = response.data.error;
                }
                $scope.$applyAsync();
            },
            function (err) {
                $scope.busy = !1;
                $scope.error = err;
            },
        );
    };

    $scope.tryImport = function (uploadForm) {
        let input = document.querySelector('#input_xlsx');
        if (!input.getAttribute('x-handle')) {
            input.setAttribute('x-handle', 'yes');
            input.addEventListener('change', () => {
                $scope.import(input.files, uploadForm);
            });
        }
        input.click();
    };

    $scope.import = function (files, uploadForm) {
        var fd = new FormData();
        fd.append('xlsxFile', files[0]);

        $http
            .post('/api/phones/import', fd, {
                withCredentials: true,
                headers: {
                    'Content-Type': undefined,
                },
                uploadEventHandlers: {
                    progress: function (e) {
                        uploadForm.uploadStatus = 'Uploading : ' + Math.round((e.loaded * 100) / e.total) + ' %';
                        if (e.loaded == e.total) {
                            uploadForm.uploadStatus = '100%';
                        }
                    },
                },
                transformRequest: angular.identity,
            })
            .then(
                function (res) {
                    if (res.data && res.data.done) {
                        uploadForm.uploadStatus = 'Done ';
                        site.hideModal('#newPhoneModal');
                        $timeout(() => {
                            $scope.loadPhoneList();
                        }, 1000 * 3);
                    }
                },
                function (error) {
                    phones.uploadStatus = error;
                },
            );
    };

    $scope.loadSetting = function () {
        $scope.error = '';
        $scope.busy = !0;
        $http({
            method: 'POST',
            url: '/api/phones/setting/load',
        }).then(
            function (response) {
                if (response.data.done) {
                    $scope.setting = { ...$scope.setting, ...response.data.setting };
                } else if (response.data.error) {
                    $scope.error = response.data.error;
                }
                $scope.busy = !1;
            },
            function (err) {
                $scope.busy = !1;
                $scope.error = err;
            },
        );
    };
    $scope.saveSetting = function () {
        $scope.error = '';
        $scope.busy = !0;
        $http({
            method: 'POST',
            url: '/api/phones/setting/save',
            data: {
                setting: $scope.setting,
            },
        }).then(
            function (response) {
                if (response.data.done) {
                    site.hideModal('#settingModal');
                } else if (response.data.error) {
                    $scope.error = response.data.error;
                }
                $scope.busy = !1;
            },
            function (err) {
                $scope.busy = !1;
                $scope.error = err;
            },
        );
    };

    $scope.loadPhoneList = function () {
        $scope.error = '';
        $scope.busy = !0;
        $http({
            method: 'POST',
            url: '/api/phones/all',
            data: {
                where: $scope.where,
            },
        }).then(
            function (response) {
                if (response.data.done) {
                    $scope.phoneList = response.data.list;
                } else if (response.data.error) {
                    $scope.error = response.data.error;
                }
                $scope.busy = !1;
            },
            function (err) {
                $scope.busy = !1;
                $scope.error = err;
            },
        );
    };

    $scope.vodafoneOpen = function () {
        SOCIALBROWSER.openWindow({
            show: true,
            audioOFF: true,
            url: $scope.setting.vodafone.loginURL,
        });
    };

    $scope.vodafoneLogin = function () {
        if ($scope.vodafoneLogedBusy) {
            return;
        }
        $scope.vodafoneLogedBusy = true;
        $scope.vodafoneCheckBrowser({ uuid: 0, govCode: '02', number: '55555555' });
    };

    $scope.vodafoneCheck = function (phone) {
        if (!phone.$force) {
            $scope.phoneCheckList.push(phone);
            return;
        }
        if ($scope.vodafoneApiSet && $scope.setting.vodafone.enabledApi) {
            $scope.vodafoneCheckApi(phone);
            return;
        }
        $scope.vodafoneCheckBrowser(phone);
    };
    $scope.vodafoneCheckBrowser = function (phone) {
        phone.vodafone = phone.vodafone || {};
        phone.vodafone.status = 'Checking ...';
        phone.vodafone.error = '';
        $scope.checkApiReady = false;
        $scope.$applyAsync();

        let win = SOCIALBROWSER.openWindow({
            show: !$scope.setting.vodafone.hideMode,
            audioOFF: true,
            url: $scope.setting.vodafone.logedURL,
            partition: 'phones-vodafone',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        });
        let code = `SOCIALBROWSER.phone123 = '${SOCIALBROWSER.hideObject(phone)}';`;
        code += `SOCIALBROWSER.adslSetting123 = '${SOCIALBROWSER.hideObject($scope.setting)}';`;
        win.eval(code + `/*##phones/vodafone.js*/`);

        win.onBeforeSendHeaders((details, callback) => {
            $scope.vodafoneHeaders = details.requestHeaders;
            callback({ requestHeaders: details.requestHeaders });
        });
        win.onBeforeRequest((details, callback) => {
            if (details.method == 'POST' && details.uploadData) {
                var bff = SOCIALBROWSER.require('Buffer');
                let txt = bff.Buffer.from(details.uploadData[0].bytes).toString();
                if (txt.startsWith('{"error":')) {
                    $scope.vodafonePayload = JSON.parse(txt);
                    $scope.vodafoneApiSet = true;
                }
            }
            callback({ cancel: false });
        });
        win.on('closed', () => {
            $scope.checkApiReady = true;
            $scope.vodafoneLogedBusy = false;
        });

        setTimeout(() => {
            if (win && !win.isDestroyed()) {
                // win.destroy();
            }
        }, 1000 * 30);
    };
    $scope.vodafoneCheckApi = function (phone) {
        $scope.checkApiReady = false;
        phone.vodafone = phone.vodafone || {};
        phone.vodafone.status = 'Checking ...';
        phone.vodafone.error = '';

        delete $scope.vodafoneHeaders['Content-Type'];
        delete $scope.vodafoneHeaders['Content-Length'];

        SOCIALBROWSER.fetchJson({
            url: $scope.setting.vodafone.entryApiURL,
            method: 'GET',
            headers: $scope.vodafoneHeaders,
        })
            .then((entity) => {
                $scope.vodafonePayload = entity;
                $scope.vodafonePayload.landLineNumber = phone.number;
                $scope.vodafonePayload.selectedArea = phone.govCode;
                $scope.vodafonePayload.fiberLandline = false;
                $scope.vodafonePayload = JSON.stringify($scope.vodafonePayload);
                $scope.vodafoneHeaders['Content-Type'] = 'application/json';
                $scope.vodafoneHeaders['Content-Length'] = $scope.vodafonePayload.length;
                $scope.checkApiReady = false;
                SOCIALBROWSER.fetchJson({
                    url: $scope.setting.vodafone.checkApiURL,
                    method: 'POST',
                    headers: $scope.vodafoneHeaders,
                    data: $scope.vodafonePayload,
                })
                    .then((response) => {
                        phone.vodafone.response = SOCIALBROWSER.copyObject(response);

                        if (response.error && response.error !== 'null') {
                            if (response.error.status == 200) {
                                $scope.vodafonePayload = response;
                                phone.vodafone.status = 'Waiting (2)';
                                phone.vodafone.error = response.error;
                                phone.vodafone.date = Date.now();
                                SOCIALBROWSER.share({ type: 'check-vodafone-done', phone: phone });

                                setTimeout(() => {
                                    SOCIALBROWSER.fetchJson({
                                        url: $scope.setting.vodafone.customerApiURL,
                                        method: 'POST',
                                        headers: $scope.vodafoneHeaders,
                                        data: $scope.vodafonePayload,
                                    }).then((customerCheck) => {
                                        // return captch

                                        $scope.vodafonePayload = customerCheck;
                                        $scope.vodafonePayload.captcha = $scope.setting.vodafone.captcha;
                                        $scope.vodafonePayload.captchaValue = $scope.setting.vodafone.captchaValue;
                                        $scope.vodafonePayload.additionalContactNumber = '12345678';
                                        $scope.vodafonePayload.address = 'qqqqqqqq';
                                        $scope.vodafonePayload.clientFullName = 'aaaaaa';
                                        $scope.vodafonePayload.customerType = '1';
                                        $scope.vodafonePayload.landLineOwnerName = 'aaaaaaa';
                                        $scope.vodafonePayload.msisdn = '12345678';
                                        $scope.vodafonePayload.nationalId = '12345671234567';
                                        $scope.vodafonePayload.error = { status: 200, errorMessage: null };
                                        console.log('fetch : ' + $scope.setting.vodafone.customerApiURL);
                                        console.log(SOCIALBROWSER.copyObject($scope.vodafoneHeaders));
                                        console.log(SOCIALBROWSER.copyObject($scope.vodafonePayload));
                                        SOCIALBROWSER.fetchJson({
                                            url: $scope.setting.vodafone.sendCustomerApiURL,
                                            method: 'POST',
                                            headers: $scope.vodafoneHeaders,
                                            data: $scope.vodafonePayload,
                                        }).then((customerCheck2) => {
                                            console.log('response : ', customerCheck2);
                                            $scope.vodafonePayload = response;
                                        });
                                    });
                                }, 1000 * 5);
                            } else if (response.error.status == 250) {
                                phone.vodafone.status = 'False (1)';
                                phone.vodafone.error = response.error;
                                phone.vodafone.date = Date.now();
                                SOCIALBROWSER.share({ type: 'check-vodafone-done', phone: phone });
                            } else {
                                phone.vodafone.status = 'Unknowm (1)';
                                phone.vodafone.error = response.error;
                                phone.vodafone.date = Date.now();
                                SOCIALBROWSER.share({ type: 'check-vodafone-done', phone: phone });
                            }
                        } else {
                            phone.vodafone.status = 'No Error (1)';
                            phone.vodafone.error = {};
                            phone.vodafone.date = Date.now();
                            SOCIALBROWSER.share({ type: 'check-vodafone-done', phone: phone });
                        }
                    })
                    .catch((err) => {
                        phone.vodafone.error = err.message;
                    })
                    .finally(() => {
                        if (phone.vodafone.status == 'Checking ...') {
                            phone.vodafone.status = 'Error Connection';
                            phone.vodafone.date = Date.now();
                            SOCIALBROWSER.share({ type: 'check-vodafone-done', phone: phone });
                        }
                        SOCIALBROWSER.log('Request Ended 2');
                        $scope.checkApiReady = true;
                    });
            })
            .catch((err) => {
                SOCIALBROWSER.log(err.message);
            })
            .finally(() => {
                SOCIALBROWSER.log('Request Ended 1');
                $scope.checkApiReady = true;
            });
    };
    $scope.vodafoneCheckAll = function () {
        $scope.phoneList.forEach((p) => {
            $scope.vodafoneCheck(p);
        });
    };
    $interval(() => {
        if ($scope.checkApiReady == true && $scope.phoneCheckList.length > 0) {
            let phone = $scope.phoneCheckList.shift();
            phone.$force = true;
            $scope.vodafoneCheck(phone);
        }
    }, 1000);

    $scope.etisalat = function () {
        if ($scope.etisalatLogedBusy) {
            return;
        }
        $scope.etisalatLogedBusy = true;

        $scope.etisalatCheck({ uuid: 0, govCode: '02', number: '55555555' });
    };

    $scope.etisalatCheck = function (phone) {
        if ($scope.etisalatLogedBusy || $scope.etisalatLoged) {
            return;
        }
        $scope.etisalatLogedBusy = true;
        let win = SOCIALBROWSER.openWindow({
            show: !$scope.setting.etisalat.hideMode,
            audioOFF: true,
            url: $scope.setting.etisalat.loginURL,
        });
        let code = `SOCIALBROWSER.phone123 = '${SOCIALBROWSER.hideObject(phone)}';`;
        code += `SOCIALBROWSER.adslSetting123 = '${SOCIALBROWSER.hideObject($scope.setting)}';`;
        win.eval(code + `/*##phones/etisalat-login.js*/`);

        win.on('closed', () => {
            $scope.etisalatLogedBusy = false;
            $scope.$applyAsync();
        });
    };

    $scope.google = function () {
        let win = SOCIALBROWSER.openWindow({
            show: true,
            audioOFF: true,
            url: 'https://www.google.com',
        });
        win.eval(`/*##phones/google.js*/`);
    };
    $scope.loadSetting();

    SOCIALBROWSER.on('share', (e, data) => {
        console.log(data);
        if (data.type === 'etisalat-login' && data.login === true) {
            $scope.etisalatLoged = true;
            $scope.$applyAsync();
        } else if (data.type === 'vodafone-login' && data.login === true) {
            $scope.vodafoneLoged = true;
            $scope.vodafoneApiSet = true;
            $scope.$applyAsync();
        } else if (data.type === 'check-vodafone-done') {
            data.phone.$force = false;
            if (data.phone.vodafone.response && data.phone.vodafone.response.error == 'null') {
                $scope.vodafoneApiSet = false;
            }
            $scope.checkApiReady = true;
            $scope.updatePhone(data.phone);
            $scope.$applyAsync();
        }
    });
});
