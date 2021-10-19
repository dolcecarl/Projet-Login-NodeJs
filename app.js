const express = require("express");
const request = require("request");
const bodyParse = require("body-parser");
const https = require ("https");
const { response } = require("express");



const app = express();

/* permet d'utiliser des fichiers statiques vres un chemin relatif  */

app.use(express.static("public"));

app.use(bodyParse.urlencoded({extended:true}));

app.get("/",function(req,res){

    res.sendFile(__dirname + "/signup.html");

   
})

app.post("/",function(req,res){

    const inputFirstName = req.body.prenom;
    const inputLastName  =  req.body.nom;
    const inputEmail = req.body.mail;
//    console.log(inputFirstName,inputLastName,inputEmail);


   const data= {
       
       members:[

        {
        

            status:"subscribed",
            
            merge_fields:{

                FNAME:inputFirstName,
                LNAME:inputLastName
            },

            email_address:inputEmail
        }

        
       ]
   };

      const jSonData = JSON.stringify(data);


     const url ="https://us5.api.mailchimp.com/3.0/lists/e5dfb6ec10";


     const options={

        method:"POST",
        auth:"dolcecarl:7728b452a1c9835f20d0881952554e7d-us5"
     }

      
      const request=https.request(url, options,function(response){


            // if(error){
            //     res.send("Oups! Une erreur lors de votre inscription, veuillez ressayer");
            // }
            // else{
                if(response.statusCode===200){
                    res.sendFile(__dirname+"/success.html");
                }
                else{
    
                    res.sendFile(__dirname+ "/failure.html");
                }
            // }
          
    
           
        response.on("data",function(data){

            console.log(JSON.parse(data));
        })
         
      })

      request.write(jSonData);
      request.end();

//    const apiKey="7728b452a1c9835f20d0881952554e7d-us5";
//    const audienceIdApi="e5dfb6ec10"
})

 app.post("/failure",function(req,res){

    res.redirect("/");
 })

app.listen(3000,function(){

    console.log("Port 3000 connecte!");
})


//  --data @- \
// <<EOF | jq '.id'
// {
//   "email_address": "$user_email",
//   "status": "subscribed",
//   "merge_fields": {
// 	"FNAME": "$user_fname",
// 	"LNAME": "$user_lname"
//   }
// }
// EOF





// #!/bin/bash
// set -euo pipefail


// event_name="Bash Developers Meetup"

// footer_contact_info='{
//   "company": "Mailchimp",
//   "address1": "675 Ponce de Leon Ave NE",
//   "address2": "Suite 5000",
//   "city": "Atlanta",
//   "state": "GA",
//   "zip": "30308",
//   "country": "US"
// }'

// campaign_defaults='{
//   "from_name": "Gettin'\'' Together",
//   "from_email": "gettintogether@example.com",
//   "subject": "Bash Developers Meetup",
//   "language": "EN_US"
// }'

// curl -sS --request POST \
//   --url "https://$API_SERVER.api.mailchimp.com/3.0/lists" \
//   --user "key:$API_KEY" \
//   --header 'content-type: application/json' \
//   --data @- \
// <<EOF | jq '.id'
// {
//   "name": "$event_name",
//   "contact": $footer_contact_info,
//   "permission_reminder": "permission_reminder",
//   "email_type_option": true,
//   "campaign_defaults": $campaign_defaults
// }
// EOF