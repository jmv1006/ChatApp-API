const con = require("../db");
const { v4: uuidv4 } = require("uuid");

exports.get_all_messages = (req, res) => {
  con.query("SELECT * FROM messages", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json(result);
  });
};

exports.create_message = (req, res) => {
  con.query(
    `INSERT INTO messages (Id, Text) VALUES ("${uuidv4()}", "${req.body.text}")`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error creating message");
      }
      res.status(200).json({ response: "Succesfully Created Message" });
    }
  );
};
