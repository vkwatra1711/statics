const mongoose = require('mongoose');
const randomInt = require('random-int');
var plotly = require('plotly')("avneetsag", "DQkthQkV1LVcth1jPJXg");
mongoose.connect('mongodb+srv://Vansh:Naman1703@cluster0.zdswl.mongodb.net', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const Fridge = require('./models/fridge');
const User = require('./models/user');
const Article = require('./models/article');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Store = require('./models/store');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});

app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});
var coordinates =
{
    x: [],
    y: [],
    type: "lines"
};

app.get('/api/stores', (req, res) => {
    Store.find({}, (err, stores) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(stores);
        }
    });
});

app.post('/api/register', (req, res) => {
    const { user, password, isAdmin } = req.body;
    console.log(req.body);
    User.findOne({ name: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (found) {
            return res.send('User already exists');
        }
        else {
            const newUser = new User({
                name: user,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err)
                    : res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    });
});

app.get('/api/fridges', (req, res) => {
    Fridge.find({}, (err, fridges) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(fridges);
        }
    });
});

app.post('/api/fridges', (req, res) => {
    const { storeId, FridgeId, Fridgename, temperatureData } = req.body;
    Store.findOne({ storeId: storeId }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (!found) {
            return res.send('Store doesnot exists');
        }
        else {
            Fridge.findOne({ storeId: storeId, FridgeId: FridgeId }, (err, exist) => {
                if (err) {
                    return res.send(err);
                }
                else if (exist) {
                    return res.send('This entry exists');
                } else {
                    const newFridge = new Fridge({
                        storeId: storeId,
                        FridgeId,
                        Fridgename,
                        temperatureData
                    });
                    newFridge.save(err => {
                        return err
                            ? res.send(err)
                            : res.json({
                                success: true,
                                message: 'successfully added the fridge'
                            });
                    });
                }
            })
        }
    });
});

app.post('/api/stores/articles', (req, res) => {
    const { storeId, ArticleId } = req.body;
    Article.findOne({ storeId: storeId, ArticleId: ArticleId }, (err, articles) => {
        if (err == true) {
            return res.send(err);
        } else if (!articles) {
            return res.send("Entry doesnot exist");
        }
        else {
            return res.send(articles);
        }
    });
});

app.post('/api/stores/article2', (req, res) => {
    const { storeId, ArticleId, ArticlePrice, Articlelocation } = req.body;
    Store.findOne({ storeId: storeId }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (!found) {
            return res.send('Store doesnot exists');
        }
        else {
            Article.findOne({ storeId: storeId, ArticleId: ArticleId }, (err, exist) => {
                if (err) {
                    return res.send(err);
                }
                else if (exist) {
                    return res.send('This entry already exist');
                }
                else {
                    const newArticle = new Article({
                        storeId,
                        ArticleId,
                        ArticlePrice,
                        Articlelocation
                    })
                    newArticle.save(err => {
                        return err
                            ? res.send(err)
                            : res.json({
                                success: true,
                                message: 'Created new article'
                            });
                    })
                }
            })
        }
    })
    })

    app.post('/api/stores', (req, res) => {
        const { storeId, address } = req.body;
        Store.findOne({ storeId: storeId }, (err, found) => {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            else if (found) {
                return res.send('Store already exists');
            }

            else {
                const newStore = new Store({
                    storeId: storeId,
                    address
                });
                newStore.save(err => {
                    console.log(err)
                    return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Created new user'
                        });
                });
            }
        });
    });

    app.post('/api/stores/delete', (req, res) => {
        const { storeId } = req.body;
        Store.findOne({ storeId: storeId }, (err, found) => {
            if (err) {
                return res.send(err);
            }
            else if (!found) {
                return res.send('Sorry. We cant find any such store');
            }
            else {
                Store.deleteOne({ storeId }, (err => {
                    return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Successfully store deleted'
                        });
                }))
            }
        })
    });

    app.post('/api/stores/article/delete', (req, res) => {
        const { storeId } = req.body;
        const { ArticleId } = req.body;
        Article.findOne({ storeId: storeId, ArticleId: ArticleId }, (err, found) => {
            if (err) {
                return res.send(err);
            }
            else if (!found) {
                return res.send('This entry does not exist');
            }
            else {
                Article.deleteOne({ storeId: storeId, ArticleId: ArticleId }, (err => {
                    return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Successfully article deleted'
                        });
                }))
            }
        })
    });

    app.post('/api/fridges/delete', (req, res) => {
        const { storeId } = req.body;
        Fridge.deleteMany({ storeId }, (err => {
            return err
                ? res.send(err)
                : res.json({
                    success: true,
                    message: 'Successfully store fridges'
                });
        }))
    })
    app.post('/api/article/delete', (req, res) => {
        const { storeId } = req.body;
        Article.deleteMany({ storeId }, (err => {
            return err
                ? res.send(err)
                : res.json({
                    success: true,
                    message: 'Successfully store fridges'
                });
        }))
    })

    var coordinates =
    {
        x: [],
        y: [],
        type: "lines"
    };

    app.get('/api/fridges/temperatureData', (req, res) => {
        function userFunction() {
            const temperature = randomInt(0, 5);
            coordinates.x.push((new Date()).toISOString());
            console.log(coordinates.x.push((new Date()).toISOString()));
            coordinates.y.push(temperature);
            console.log(coordinates.y.push(temperature));

            var graphOptions =
            {
                filename: "fridgess",
                fileopt: "overwrite"
            };
            plotly.plot(coordinates, graphOptions, function (err, msg) {
                if (err) return console.log(err);
                console.log(msg);
            });
        }
        setInterval(userFunction, 4000);
    })

    app.post('/api/fridges/temperatureData', (req, res) => {

        const FridgeId = req.body.FridgeId;
        const time = req.body.time;
        const temperature = req.body.temperature;

        Fridge.findOne({ "FridgeId": FridgeId }, (err, fridge) => {
            if (err) {
                console.log(err)
            }
            const { temperatureData } = fridge;
            temperatureData.push({ time, temperature });
            fridge.temperatureData = temperatureData;
            fridge.save(err => {
                return err
                    ? res.send(err)
                    : res.send(temperatureData);
            });
        });
    })

    app.post('/api/stores/fridge/delete', (req, res) => {
        const { storeId } = req.body;
        const { FridgeId } = req.body;
        Fridge.findOne({ storeId: storeId, FridgeId: FridgeId }, (err, found) => {
            if (err) {
                return res.send(err);
            }
            else if (!found) {
                return res.send('This entry does not exist');
            }
            else {
                Fridge.deleteOne({ storeId: storeId, FridgeId: FridgeId }, (err => {
                    return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Successfully store deleted'
                        });
                }))
            }
        })
    });

    app.post('/api/stores/article3', (req, res) => {
        const { storeId } = req.body;
        const { ArticleId } = req.body;
        const { ArticlePrice } = req.body;
        Article.findOne({ storeId: storeId, ArticleId: ArticleId }, (err, found) => {
            if (err) {
                return res.send(err);
            }
            else if (!found) {
                return res.send('This entry does not exist');
            }
            else {
                Article.updateOne({ storeId: storeId, ArticleId: ArticleId }, {$set:{ArticlePrice:ArticlePrice}},(err => {
                    return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Successfully updated'
                        });
                }))
            }
        })
    });

    app.post('/api/stores/article4', (req, res) => {
        const { storeId } = req.body;
        const { ArticleId } = req.body;
        const { Articlelocation } = req.body;
        Article.findOne({ storeId: storeId, ArticleId: ArticleId }, (err, found) => {
            if (err) {
                return res.send(err);
            }
            else if (!found) {
                return res.send('This entry does not exist');
            }
            else {
                Article.updateOne({ storeId: storeId, ArticleId: ArticleId }, {$set:{Articlelocation:Articlelocation}},(err => {
                    return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Successfully updated'
                        });
                }))
            }
        })
    });

    app.post('/api/authenticate', (req, res) => {
        const { user, password } = req.body;
        console.log(req.body);
        User.findOne({ name: user }, (err, found) => {
            if (err) {
                return res.send(err);
            }
            else if (!found) {
                return res.send('Sorry. We cant find any such username');
            }
            else if (found.password != password) {
                return res.send('The password is invalid');
            }
            else {
                return res.json({
                    success: true,
                    message: 'Authenticated successfully',
                    isAdmin: found.isAdmin
                });
            }
        });
    });

    // app.post('/api/register', (req, res) => {
    //     const { user, password, isAdmin } = req.body;
    //     console.log(req.body);
    //     User.findOne({ name: user }, (err, found) => {
    //         if (err) {
    //             return res.send(err);
    //         }
    //         else if (found) {
    //             return res.send('User already exists');
    //         }
    //         else {
    //             const newUser = new User({
    //                 name: user,
    //                 password,
    //                 isAdmin
    //             });
    //             newUser.save(err => {
    //                 return err
    //                     ? res.send(err)
    //                     : res.json({
    //                         success: true,
    //                         message: 'Created new user'
    //                     });
    //             });
    //         }
    //     });
    // });

    app.get('/api/fridges/:fridgeId/fridge-history', (req, res) => {
        const { fridgeId } = req.params;
        Fridge.findOne({ "_id": fridgeId }, (err, fridges) => {
            const { temperatureData } = fridges;
            return err
                ? res.send(err)
                : res.send(temperatureData);
        });
    });


    app.get('/api/users/:user/fridges', (req, res) => {
        const { user } = req.params;
        Fridge.find({ "name": user }, (err, fridges) => {
            return err
                ? res.send(err)
                : res.send(fridges);
        });
    })

    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
