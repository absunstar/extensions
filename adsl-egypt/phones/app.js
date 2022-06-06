module.exports = function (site) {
    site.security.addKey('d1f5c7d1bf841961b9f17329b44873c9');
    let $collection = site.connectCollection({
        db: 'egypt-dsl',
        collection: 'phones',
    });
    $collection.createUnique(
        {
            govCode: 1,
            number: 1,
        },
        (err, result) => {
            console.log(err || result);
        },
    );
    site.adslSettingPath = site.path.join(__dirname + '/site_files/json/adslSetting.json');
    site.adslSetting = JSON.parse(site.readFileSync(site.adslSettingPath));

    site.onGET({
        name: '/phones-images',
        path: site.path.join(__dirname, '/site_files/images/'),
    });

    site.onGET({
        name: '/phones',
        path: site.path.join(__dirname, '/site_files/html/index.html'),
        parser: 'html css js',
    });

    site.onPOST('/api/phones/add', (req, res) => {
        let phone = req.data.phone;
        $collection.add(phone, (err, doc) => {
            if (!err && doc) {
                res.json({
                    done: true,
                    doc: doc,
                });
            } else {
                res.json({
                    done: false,
                    error: err ? err.message : 'Phone Exists',
                    doc: phone,
                });
            }
        });
    });
    site.onPOST('/api/phones/delete', (req, res) => {
        let phone = req.data.phone;
        $collection.delete(phone, (err, result) => {
            if (!err) {
                res.json({
                    done: true,
                    result: result,
                });
            } else {
                res.json({
                    done: false,
                    error: err.message,
                    result: result,
                });
            }
        });
    });
    site.onPOST('/api/phones/update', (req, res) => {
        let phone = req.data.phone;
        $collection.update(phone, (err, result) => {
            if (!err) {
                res.json({
                    done: true,
                    result: result,
                });
            } else {
                res.json({
                    done: false,
                    error: err.message,
                    result: result,
                });
            }
        });
    });
    site.onPOST('/api/phones/all', (req, res) => {
        $collection.findAll({}, (err, docs) => {
            if (!err && docs) {
                res.json({
                    done: true,
                    list: docs,
                });
            } else {
                res.json({
                    done: false,
                    error: err ? err.message : 'unKnowing Error',
                    list: [],
                });
            }
        });
    });

    site.post('api/phones/import', (req, res) => {
        let response = {
            done: false,
            file: req.form.files.xlsxFile,
        };

        if (req.session.user === undefined) {
            response.error = 'You are not login';
            res.json(response);
            return;
        }

        if (!response.file) {
            response.error = 'No File Uploaded';
            res.json(response);
            return;
        }
        if (site.isFileExistsSync(response.file.filepath)) {
            let docs = [];
            if (response.file.originalFilename.like('*.xlsx')) {
                let workbook = site.XLSX.readFile(response.file.filepath);
                docs = site.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            } else {
                docs = site.fromJson(site.readFileSync(response.file.filepath).toString());
            }

            if (Array.isArray(docs)) {
                console.log('Importing Array Count : ' + docs.length);
                docs.forEach((doc) => {
                    if (doc['govCode ']) {
                        doc.govCode = doc['govCode '];
                        delete doc['govCode '];
                    }
                    if (doc.govCode && doc.number) {
                        doc.govCode = doc.govCode.toString();
                        doc.number = doc.number.toString();
                        if (!doc.govCode.startsWith('0')) {
                            doc.govCode = '0' + doc.govCode;
                        }
                    } else {
                        console.log('No govCode or number', doc);
                        return;
                    }
                    $collection.addOne(doc, (err, doc2) => {
                        if (!err && doc2) {
                            site.dbMessage = 'import doc id : ' + doc2.id;
                            console.log(site.dbMessage);
                        } else {
                            site.dbMessage = err.message;
                            console.log(site.dbMessage);
                        }
                    });
                });
            } else if (site.typeof(docs) === 'Object') {
                $collection.addOne(docs, (err, doc2) => {
                    if (!err && doc2) {
                        site.dbMessage = 'import doc id : ' + doc2.id;
                        console.log(site.dbMessage);
                    } else {
                        site.dbMessage = err.message;
                        console.log(site.dbMessage);
                    }
                });
            } else {
                site.dbMessage = 'can not import unknown type : ' + site.typeof(docs);
                console.log(site.dbMessage);
            }
        } else {
            site.dbMessage = 'file not exists : ' + response.file.filepath;
            console.log(site.dbMessage);
            console.log(req.form);
        }

        res.json(response);
    });

    site.onPOST('/api/phones/setting/load', (req, res) => {
        res.json({
            done: true,
            setting: site.adslSetting,
        });
    });
    site.onPOST('/api/phones/setting/save', (req, res) => {
        site.adslSetting = req.data.setting;
        site.writeFileSync(site.adslSettingPath, JSON.stringify(site.adslSetting));

        res.json({
            done: true,
            setting: site.adslSetting,
        });
    });
};
