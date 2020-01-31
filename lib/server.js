const http = require("http");
const fs = require("fs");
const url = require("url");

const spinUp = () => {
  http
    .createServer((req, res) => {
      fs.readFile("./lib/authpages/gitstarted.html", function(err, data) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
          return;
        }
        res.writeHead(200);
        res.end(data);
      });

      const currentUrl = new URL(request.url);
      const params = currentUrl.searchParams;

      if (params.has("code")) {
        const code = params.get("code");
        const url = "https://github.com/login/oauth/access_token";
        const requestParams = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
        try {
          fetch(url, {
            method: "POST",
            credentials: "include",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: requestParams
          })
            .then(response => response.json())
            .then(data => {
                if (data.access_token){
                    confi
                }
            });
        } catch (error) {
          throw error;
        }
      }
    })
    .listen(5001);

  return authParams;
};

exports.spinUp = spinUp;
