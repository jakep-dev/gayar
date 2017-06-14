// const express = require("express");
// const router = express.Router();

// router.get('/', function(req, res){
//     res.send('api works');
// });

// module.exports = router;


export abstract class BaseRoute {
    public PerformRequest(endpoint:string, method: string, data:any, success:any): any{}
}





  