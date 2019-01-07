var mysql = require('mysql');
var express  = require('express');
var app      = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var formidable = require('formidable');
var fs = require('fs');
var config = require('./server-config.js');

app.use(morgan(':method :url :status'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

// ///////////////////
// DATABASE FUNCTIONS
var db_query = function(query){
  return new Promise(function(resolve, reject){
    var con = mysql.createPool({
      host                : config.DBHOST,
      user                : config.DBUSER,
      password            : config.DBPASSWORD,
      database            : config.DBNAME,
      waitForConnections  : true
    });
    con.getConnection(function(err, con) {
      if (err) throw err; // not connected!
      // Use the connection
      con.query(query, function (error, rows, fields) {
        con.release();
        if (error) throw error;
        if(rows === undefined) {
            reject(new Error("Error rows is undefined"));
        } else {
            resolve(rows);
        }
      });
    });
  });
};

var select_query = function(table, rows = "*", where = false, orderby = false){

  let query = "SELECT " + rows + " FROM " + table;
  if (where) {
    query += " WHERE " + where;
  }
  if (orderby) {
    query += " ORDER BY " + orderby;
  }
  return db_query(query);
};
// \DATABASE FUNCTIONS
// \\\\\\\\\\\\\\\\\\\


// ///////////////////////////////
// UPLOAD IMAGES GENERIC FUNCTION
var uploadImage = function(distination, req, res) {
  new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
      try {
        if (fs.existsSync(`${config.PUBLIC_FRONT_DIRECTORY}`) && fs.existsSync(`${config.PUBLIC_FRONT_DIRECTORY}${distination}`)) {
          file.path = `${config.PUBLIC_FRONT_DIRECTORY}${distination}${file.name}`;
        } else {
          throw Error(`Directory "${config.PUBLIC_FRONT_DIRECTORY}${distination}" is invalid!`);
        }
      } catch(err) {
        console.log({status: 401, message: `Promise rejection error: ${err}`});
      }
    })
    .on('file', (name, file) => {
      try {
        if (file.path && fs.existsSync(`${config.PUBLIC_FRONT_DIRECTORY}${distination}${file.name}`)) {
          res.json({file: file, path: `${distination}${file.name}`});
        } else {
          throw Error(`Directory "${config.PUBLIC_FRONT_DIRECTORY}${distination}" is invalid!`);
        }
      } catch(err) {
        res.json({status: 401, message: `Promise rejection error: ${err}`});
      }
    })
    .on('aborted', () => {
      res.json({status: 401, message: "Promise rejection error: Request aborted by the user"});
    })
    .on('error', (err) => {
      res.json({status: 401, message: "Promise rejection error: "+err});
    })
    .on('end', () => {
      res.end()
    });
}
// \UPLOAD IMAGES GENERIC FUNCTION
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// //////////////
// EXPERIENCE API
async function getCompanyRelatedProjects(companyRow) {
  const projects = await select_query(`${config.DBNAME}.${config.DBTABLE_PROJECTS}`, " * ", ` company = ${companyRow.id} `).then(function(results){
    return results;
  }).catch(function(err){
    return [];
  });
  companyRow.projects = projects;
  return companyRow;
}

app.get('/api/get/experience', async function(req, res) {
  let companies = await select_query(`${config.DBNAME}.${config.DBTABLE_EXPERIENCES}`, "*", false, 'ordr ASC').then(async function(results){
    var finalCompaniesResults = [];
    for (var i = 0; i < results.length; i++) {
      await getCompanyRelatedProjects(results[i]).then(function(result){
        finalCompaniesResults[i] = result;
      });
    }
    res.json(finalCompaniesResults);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.get('/api/get/experience/projects/:id', function(req, res) {
  let companyId = req.params.id;
  select_query(`${config.DBNAME}.${config.DBTABLE_PROJECTS}`, " * ", ` company = ${companyId} `).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/experience/publish', function(req, res) {
  let data = req["body"];
  let sql = "";
  if (data.id) {
      sql = ` UPDATE ${config.DBNAME}.${config.DBTABLE_EXPERIENCES}
              SET
                company = '${data.company}',
                company_logo = '${data.company_logo}',
                company_website = '${data.company_website}',
                company_location = '${data.company_location}',
                position = '${data.position}',
                description = '${data.description.replace(/'/g, "\\'")}',
                start_date = '${data.start_date}',
                end_date = '${data.end_date}'
              WHERE
                id = ${data.id};
            `;
  } else {
    sql = ` INSERT
            INTO ${config.DBNAME}.${config.DBTABLE_EXPERIENCES}
                (company,
                company_logo,
                company_website,
                company_location,
                position,
                description,
                start_date,
                end_date)
            VALUES
                ('${data.company}',
                '${data.company_logo}',
                '${data.company_website}',
                '${data.company_location}',
                '${data.position}',
                '${data.description.replace(/'/g, "\\'")}',
                '${data.start_date}',
                '${data.end_date}');
            `;
  }
  db_query(sql).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/experience/sort', function(req, res){
  let data = req["body"];

  let sql = `UPDATE ${config.DBNAME}.${config.DBTABLE_EXPERIENCES}
    SET ordr = CASE id `;
    for (var i = 0; i < data.length; i++) {
      sql += ` WHEN ${data[i]} THEN ${i+1}`
    }
    sql += ` ELSE 999 END
    WHERE id IN(${data.toString()});`;

    db_query(sql).then(function(results){
      res.json(results);
    }).catch(function(err){
      res.json({status: 401, message: "Promise rejection error: "+err});
    });
});

app.post('/api/experience/remove', function(req, res) {
  let id = req["body"].id;
  sql = ` DELETE FROM ${config.DBNAME}.${config.DBTABLE_EXPERIENCES}
          WHERE
            id = ${id};`;

  db_query(sql).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/company/logo/upload', function(req, res) {
  uploadImage(config.PUBLIC_FRONT_ASSETS_COMPANIES_DIRECTORY, req, res);
});
// \EXPERIENCE API
// \\\\\\\\\\\\\\\

// ///////////
// SKILLS API
app.get('/api/get/skills', function(req, res) {
  select_query(`${config.DBNAME}.${config.DBTABLE_SKILLS}`, "*", false, 'ordr ASC').then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/skill/publish', function(req, res) {
  let data = req["body"];
  let sql = "";
  if (data.id) {
      sql = ` UPDATE ${config.DBNAME}.${config.DBTABLE_SKILLS}
              SET
                title = '${data.title}',
                icon = '${data.icon}',
                description = '${data.description}',
                category = '${data.category}',
                years_of_experience = '${data.years_of_experience}'
              WHERE
                id = ${data.id};
            `;
  } else {
    sql = ` INSERT
            INTO ${config.DBNAME}.${config.DBTABLE_SKILLS}
                (title,
                icon,
                description,
                category,
                years_of_experience)
            VALUES
                ('${data.title}',
                '${data.icon}',
                '${data.description}',
                '${data.category}',
                '${data.years_of_experience}');
            `;
  }
  db_query(sql).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/skills/sort', function(req, res){
  let data = req["body"];

  let sql = `UPDATE ${config.DBNAME}.${config.DBTABLE_SKILLS}
    SET ordr = CASE id `;
    for (var i = 0; i < data.length; i++) {
      sql += ` WHEN ${data[i]} THEN ${i+1}`
    }
    sql += ` ELSE 999 END
    WHERE id IN(${data.toString()});`;

    db_query(sql).then(function(results){
      res.json(results);
    }).catch(function(err){
      res.json({status: 401, message: "Promise rejection error: "+err});
    });
});

app.post('/api/skill/logo/upload', function(req, res) {
  uploadImage(config.PUBLIC_FRONT_ASSETS_SKILLS_DIRECTORY, req, res);
});

app.post('/api/skill/remove', function(req, res) {
  let id = req["body"].id;
  sql = ` DELETE FROM ${config.DBNAME}.${config.DBTABLE_SKILLS}
          WHERE
            id = ${id};`;

  db_query(sql).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});
// \SKILLS API
// \\\\\\\\\\\

// /////////////
// PORTFOLIO API
app.get('/api/get/projects', function(req, res) {
  select_query(`${config.DBNAME}.${config.DBTABLE_PROJECTS}`, "*", false, 'ordr ASC').then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/project/screenshot/upload', function(req, res) {
  uploadImage(config.PUBLIC_FRONT_ASSETS_PROJECTS_DIRECTORY, req, res);
});

app.post('/api/project/publish', function(req, res) {
  let data = req["body"];
  let sql = "";
  if (data.id) {
      sql = ` UPDATE ${config.DBNAME}.${config.DBTABLE_PROJECTS}
              SET
                screenshots = '${data.screenshots}',
                title = '${data.title}',
                description = '${data.description}',
                tags = '${data.tags}',
                link = '${data.link}',
                company = '${data.company}'
              WHERE
                id = ${data.id};
            `;
  } else {
    sql = ` INSERT
            INTO ${config.DBNAME}.${config.DBTABLE_PROJECTS}
                (screenshots,
                title,
                description,
                tags,
                link,
                company)
            VALUES
                ('${data.screenshots}',
                '${data.title}',
                '${data.description}',
                '${data.tags}',
                '${data.link}',
                '${data.company}');
            `;
  }
  db_query(sql).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/projects/sort', function(req, res){
  let data = req["body"];

  let sql = `UPDATE ${config.DBNAME}.${config.DBTABLE_PROJECTS}
    SET ordr = CASE id `;
    for (var i = 0; i < data.length; i++) {
      sql += ` WHEN ${data[i]} THEN ${i+1}`
    }
    sql += ` ELSE 999 END
    WHERE id IN(${data.toString()});`;

    db_query(sql).then(function(results){
      res.json(results);
    }).catch(function(err){
      res.json({status: 401, message: "Promise rejection error: "+err});
    });
});

app.post('/api/project/remove', function(req, res) {
  let id = req["body"].id;
  sql = ` DELETE FROM ${config.DBNAME}.${config.DBTABLE_PROJECTS}
          WHERE
            id = ${id};`;

  db_query(sql).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});
// \PORTFOLIO API
// \\\\\\\\\\\\\\

// ///////////
// WEBSITE API
app.get('/api/get/about_me', function(req, res) {
  select_query(`${config.DBNAME}.${config.DBTABLE_WEBSITE}`, 'about_me').then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});

app.post('/api/about_me/publish', function(req, res) {
  let data = req["body"];
  let sql = "";
  sql = ` UPDATE ${config.DBNAME}.${config.DBTABLE_WEBSITE}
          SET
            about_me = '${data.aboutme.replace(/'/g, "\\'")}'
          WHERE
            id = 0
        `;
  db_query(sql).then(function(results){
    res.json(results);
  }).catch(function(err){
    res.json({status: 401, message: "Promise rejection error: "+err});
  });
});
// \WEBSITE API
// \\\\\\\\\\\\

// ///////////
// MAIL API
app.post('/api/mail/send', function(req, res) {
  let data = req["body"];
  let requestError = false;



  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Ninjitsu, Abdullah Salem" <hey@ninjitsu.co>', // sender address
    to: data.email_address, // list of receivers
    subject: 'Your request has been received', // Subject line
    html: '<p>Thank you for contacting me!</p><p>Your request has been received, I will review the request very soon and get back to you. Have a good day!</p>' // html body
  };

  let notificationOptions = {
    from: 'Notifier <hey@ninjitsu.co>', // sender address
    to: "hey@ninjitsu.co", // list of receivers
    subject: 'NEW REQUEST NOTIFICATION', // Subject line
    html: `
      <div>
        <p>Below are the details of the requester</p>
        <ul>
          <li>Name: ${data.full_name}</li>
          <li>Email: ${data.email_address}</li>
          <li>Tel: ${data.mobile_number}</li>
          <li>Message: ${data.message}</li>
        </ul>
      </div>
    `
  };

  config.MAIL_TRANSPORTER.sendMail(notificationOptions, (error, info) => {
    if (error) {
      requestError = error;
    }
  });

  config.MAIL_TRANSPORTER.sendMail(mailOptions, (error, info) => {
    if (error) {
      requestError = error;
    }
  });

  if (requestError) {
    res.json({status: 401, message: "Well, it happens on the biggest websites! Sending your email has failed, please try again in a while :("});
    return console.log(requestError);
  } else {
    res.json({status: 200, message: 'Your message has been sent successfully :D'});
  }
});
// \MAIL API
// \\\\\\\\\\\\

// ///////////////////
// AUTHENTICATIONS API
app.post('/api/auth/login', function(req, res) {
  let data = req["body"];
  console.log(data);
  if (data.username == config.ADMIN_USERNAME && data.password == config.ADMIN_PASSWORD) {
    res.json({status: 200, message: 'Login successfully.', token: "wfeRQ2FzKm"});
  } else {
    res.json({status: 500, message: "Illegal Action! what are you trying to do?!"});
  }
});
// \AUTHENTICATIONS API
// \\\\\\\\\\\\\\\\\\\\


// DEFAULT ROUTE
app.get('/*',function(req,res){
  res.json({status: 404, message: "WE DON'T SPEAK ALIEN LANGUAGE!"});
});
