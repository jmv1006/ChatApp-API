const con = require("../db");
const { v4: uuidv4 } = require("uuid");

exports.get_messages = (req, res) => {
  con.query(
    `SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}"`, (err, result) => {
      if(err) {
        console.log(err);
        return res.status(400).json("Error finding chatroom")
      };

      if(result.length === 0) {
        return res.status(400).json("Chatroom does not exist")
      };

      con.query(`SELECT * FROM Messages WHERE Chatroom="${req.params.chatroomId}" ORDER BY Time`, (err, result) => {
        if (err) {
          console.log(err);
        }
        return res.status(200).json(result);
      });
    }
  )
};

exports.create_message = (req, res) => {
  const formattedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  con.query(
    `SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}"`, (err, result) => {
      if(err) {
        console.log(err);
        return res.status(400).json("Error finding chatroom")
      }

      if(result.length === 0) {
        //Chatroom does not exist
        return res.status(400).json("Error finding chatroom")
      }

      con.query(
        `INSERT INTO messages (Id, Text, Time, UserId, Chatroom) VALUES ("${uuidv4()}", "${req.body.text}", "${formattedTime}", "${req.body.userid}", "${req.params.chatroomId}")`, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json("Error creating message");
          }
          res.status(200).json("Succesfully Created Message");
        }
      );
    }
  )
};

exports.create_chatroom = (req, res) => {
  con.query(
    `INSERT INTO Chatrooms (Id, Member1, Member2) VALUES ("${uuidv4()}", "${req.body.member1}", "${req.body.member2}") `, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error creating chatroom");
      }
      res.status(200).json({ response: "Succesfully Created Chatroom" });
    }
  );
};

exports.get_all_chatrooms = (req, res) => {
  con.query("SELECT * FROM Chatrooms", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
};

exports.get_specific_chatroom = (req, res) => {
  con.query(`SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}" `, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
};