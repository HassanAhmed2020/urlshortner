    var express = require('express');
    var path = require('path');
    

    var myApp = express();
    
    
    var inputURL;
    
    
    //serve static index.html file using static middleware from the public folder
    myApp.use('/', express.static(path.join(__dirname, 'public')));
    
    
    //use body parser middleware to capture and parse the request
    //myApp.use(bodyparser.urlencoded({extended: false}));
    
    
    
    myApp.get('/*', function (request, response)
                                {
                                  
                                  inputURL = request.params;
                                  console.log(inputURL);
                                

                                }
            );                    


    myApp.listen(process.env.PORT,process.env.IP, function() {
                                                                console.log("Listening on port: " + process.env.PORT);
                                                                console.log("Listening on IP: " + process.env.IP);
                                                            }
                );  