const con = require("../db");
const { v4: uuidv4 } = require("uuid");
const joi = require('joi');

exports.get_messages = async (req, res) => {
  con.query(
    `SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}"`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error finding chatroom");
      }

      if (result.length === 0) {
        return res.status(400).json("Chatroom does not exist");
      }

      con.query(
        `SELECT * FROM Messages WHERE Chatroom="${req.params.chatroomId}" ORDER BY Time`,
        (err, result) => {
          if (err) {
            console.log(err);
          };

          return res.status(200).json(result);
        }
      );
    }
  );
};

exports.create_message = (req, res) => {
  const schema = joi.object({
    text: joi.string()
        .min(1)
        .required(),
    userid: joi.string()
      .required()
  });

  const { error } = schema.validate(req.body, {abortEarly: false})

  if(error) {
      res.status(400).json("Error Sending Message")
      return
  };

  const formattedTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  con.query(
    `SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}"`,
    (err, result) => {
      if (err) {
        return res.status(400).json("Error finding chatroom");
      }

      if (result.length === 0) {
        //Chatroom does not exist
        return res.status(400).json("Chatroom does not exist");
      }

      con.query(
        `INSERT INTO Messages (Id, Text, Time, UserId, Chatroom) VALUES ("${uuidv4()}", "${req.body.text}", "${formattedTime}", "${req.body.userid}", "${req.params.chatroomId}")`,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json("Error creating message");
          }
          res.status(200).json("Succesfully Created Message");
        }
      );
    }
  );
};

exports.create_chatroom = (req, res) => {
  if(req.body.member1 === req.body.member2) {
    return res.status(400).json("Cannot create a chat between the same user!")
  };

  con.query(
    `SELECT * FROM Chatrooms WHERE Member1="${req.body.member1}" AND Member2="${req.body.member2}" OR Member1="${req.body.member2}" AND Member2="${req.body.member1}"`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error creating chatroom");
      } 

      if (result.length > 0) {
        return res.status(400).json("Chat between users already exists");
      }

      con.query(
        `INSERT INTO Chatrooms (Id, Member1, Member2) VALUES ("${uuidv4()}", "${req.body.member1}", "${req.body.member2}") `,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json("Error creating chatroom");
          }
          res.status(200).json({ response: "Succesfully Created Chatroom" });
        }
      );
    }
  );
};

exports.get_all_chatrooms = (req, res) => {
  con.query("SELECT * FROM Chatrooms", (err, result) => {
    if (err) {
      console.log(err);
      return
    }
    res.status(200).json(result);
  });
};

exports.get_specific_chatroom = (req, res) => {
  con.query(
    `SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}" `,
    (err, result) => {
      if (err) {
        return res.status(500).json("Server error")
      }
      
      if (result.length === 0) {
        return res.status(400).json("Error finding chatroom");
      }

      con.query(`SELECT * FROM Users WHERE Id ="${result[0].Member1}" OR Id="${result[0].Member2}"`, (err, userResult) => {
        let Member1Name;
        let Member2Name;

        if(result[0].Member1 === userResult[0].Id) {
          Member1Name = userResult[0].DisplayName
          Member2Name = userResult[1].DisplayName
        } else {
          Member1Name = userResult[1].DisplayName
          Member2Name = userResult[0].DisplayName
        }

        const data = [{
          Id: result[0].Id,
          Member1: result[0].Member1,
          Member2: result[0].Member2,
          Member1Name: Member1Name,
          Member2Name: Member2Name
        }];

        return res.status(200).json(data)
      })  
    }
  );
};

exports.get_user_chatrooms = async (req, res) => {
  
  con.query(
    `SELECT * FROM Chatrooms WHERE Member1="${req.params.userId}" OR Member2="${req.params.userId}"`,
    (err, result) => {
      if (err) {
        return res.status(500).json("Error connecting to db")
      }
      return res.status(200).json(result);
    }
  );
};

exports.get_paginated_messages = (req, res) => {
  con.query(`SELECT * FROM Messages WHERE Chatroom="${req.params.chatroomId}"`, (err, messages) => {

    const messagesAmount = messages.length;
    
    con.query(`(
      SELECT * FROM Messages
      WHERE Chatroom="${req.params.chatroomId}"
      ORDER BY Time
      DESC LIMIT 0, ${req.params.pageNumber}
    ) ORDER BY Time`, (err, result) => {

      const infoObject = {
        messages: result,
        messagesAmount: messagesAmount
      };

      res.status(200).json(infoObject)
    })
  })
};