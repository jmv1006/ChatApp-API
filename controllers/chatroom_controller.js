const con = require("../db");
const { v4: uuidv4 } = require("uuid");

exports.get_messages = (req, res) => {
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
          }
          return res.status(200).json(result);
        }
      );
    }
  );
};

exports.create_message = (req, res) => {
  const formattedTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  con.query(
    `SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}"`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error finding chatroom");
      }

      if (result.length === 0) {
        //Chatroom does not exist
        return res.status(400).json("Error finding chatroom");
      }

      con.query(
        `INSERT INTO messages (Id, Text, Time, UserId, Chatroom) VALUES ("${uuidv4()}", "${
          req.body.text
        }", "${formattedTime}", "${req.body.userid}", "${
          req.params.chatroomId
        }")`,
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
  con.query(
    `SELECT * FROM Chatrooms WHERE Member1="${req.body.member1}" AND Member2="${req.body.member2}"`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error creating chatroom");
      }

      if (result.length > 0) {
        return res.status(400).json("Chat between users already exists");
      }

      con.query(
        `INSERT INTO Chatrooms (Id, Member1, Member2, Member1Name, Member2Name) VALUES ("${uuidv4()}", "${
          req.body.member1
        }", "${req.body.member2}", "${req.body.member1name}", "${
          req.body.member2name
        }") `,
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
    }
    res.status(200).json(result);
  });
};

exports.get_specific_chatroom = (req, res) => {
  con.query(
    `SELECT * FROM Chatrooms WHERE Id="${req.params.chatroomId}" `,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length === 0) {
        res.status(400).json("Error finding chatroom");
      }
      res.status(200).json(result);
    }
  );
};

exports.get_user_chatrooms = (req, res) => {
  con.query(
    `SELECT * FROM Chatrooms WHERE Member1="${req.params.userId}" OR Member2="${req.params.userId}"`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length === 0) {
        res.status(400).json("User does not have any active chats");
      }
      //chat id and other member
      res.status(200).json(result);
    }
  );
};
