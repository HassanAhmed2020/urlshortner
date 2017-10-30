    var express = require('express');
    var path = require('path');
    var MongoClient = require('mongodb').MongoClient;
    
    //DB name is urlshortnerdb
    //var url = "mongodb://localhost:27017/urlshortnerdb";
    var url = "mongodb://dbuser:MyPass1@ds141185.mlab.com:41185/hussurlshortner";
    


    var myApp = express();
    
    
    var inputURL;
    var newIdNum = null;
    var myobj;
    var shortURL;
    
    
    //serve static index.html file using static middleware from the public folder
    myApp.use('/', express.static(path.join(__dirname, 'public')));
    
    
    //use body parser middleware to capture and parse the request
    //myApp.use(bodyparser.urlencoded({extended: false}));
    


//==============================================================================================================================================================================                                                                        
//====================This sections ofthe app is used for redirecting to the original URL if an existing url IDNum is found=====================================================

    
    myApp.get('/:id', function (request, response)
                                {
                                  
                                    inputURL = request.params.id;
                                    console.log(inputURL);
                                    //console.log(inputURL[0]);


                                    //connect to the database
                                    MongoClient.connect(url, function(err, db) 
                                    {
                                        if (err) throw err;

                                        
                                        var query = { idNum: parseInt(inputURL) };
                                        
                                        db.collection("urlcollection").find(query).toArray(function(err, queryresult) 
                                            {
                                                if (err) throw err;
                                                
                                                console.log(queryresult.length);
                                                
                                                
                                                //console.log(queryresult[0].idNum);
                                                
                                                if (queryresult.length > 0)
                                                {
                                                    console.log("Short URL Already exist");
                                                    //response.end(queryresult[0].originalURL);
                                                    response.redirect(queryresult[0].originalURL);
                                                }
                                                else
                                                {
                                                    console.log("Short URL Doesn't exist");
                                                    response.end("Oppps!! Short URL doesn't exist in the Database");
                                                }
                                                console.log(queryresult);
                                                db.close();
                                                response.end();
                                             });   
                                    });
                                        
                                });
                                
                                
                                
                                
                                
                                
//==============================================================================================================================================================================                                                                                                            
//=====================================This Section of the APP is used for adding new urls to the database======================================================================

    myApp.get('/new/*', function (request, response)
                                {
                                    inputURL = request.params;
                                    console.log(inputURL[0]);
                                    MongoClient.connect(url, function(err, db)
                                        {
                                            if (err) throw err;
                                            
                                            var url = inputURL[0];
                                            //var url = 'https://www.google.com';
                                            var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
                                            
                                            
                                            if (!valid)
                                            {
                                                //response.end("You Entered a bad Found a bad URL");
                                                response.end(JSON.stringify({error: "URL  is ivalid"}));
                                            }
                                            
                                            else
                                            {
                                        
                                                    db.collection("urlcollection").find({}).sort({_id:-1}).limit(1).toArray(function(err, result) 
                                                                                {
                                                                                    if (err) throw err
                                                                                    //console.log(result[0].idNum);
                
                
                                                                             
                                                                                
                                                                                    db.collection("urlcollection").count(function(err, count) 
                                                                                            {
                                                                                                if (err) throw err;
                                                                                                
                                                                                                if (count == 0)
                                                                                                {
                                                                                                    //shrtURL = inputURL[0] + "HAHAHAHAHA";
                                                                                                    myobj = { originalURL: inputURL[0], idNum: 1000, shortURL: inputURL[0] +"/" +1000  };
                                                                                                }
                                                                                                
                                                                                                else
                                                                                                {
                                                                                                    newIdNum = result[0].idNum + 1;
                                                                                                    myobj = { originalURL: inputURL[0], idNum: newIdNum, shortURL: inputURL[0] + "/" + newIdNum };
                                                                                                }
                                                                                                
                                                                                                
                                                                                                
                                                                                                db.collection("urlcollection").insertOne(myobj, function(err, res) 
                                                                                                                    {
                                                                                                                        if (err) throw err;
                                                                                                                        console.log("1 document inserted");
                                                                                                                        db.close();
                                                                                                                        response.end(JSON.stringify({OriginalURL: myobj.originalURL, ShortenURL: myobj.shortURL}));
                                                                                                                        //response.write("Original URL: " + myobj.originalURL);
                                                                                                                        //response.write("\nShorten URL: " + myobj.shortURL);
                                                                                                                        //response.end();
                                                                                                                        
                                                                                                                    });
                
                                                                                            
                                                                                                                                        
                                                                                            
                                                                                            
                                                                                          });
                                                                            
                                                                                
                                                                                });
                                            }
                                        });
                                });
                                        

//==============================================================================================================================================================================                                                                                                            


                                  




                                

        


    myApp.listen(process.env.PORT,process.env.IP, function() {
                                                                console.log("Listening on port: " + process.env.PORT);
                                                                console.log("Listening on IP: " + process.env.IP);
                                                            });  