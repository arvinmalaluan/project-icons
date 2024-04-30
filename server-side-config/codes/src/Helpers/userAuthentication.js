const bcrypt = require("bcrypt");

module.exports = {
  signin: async (fetched, payload) => {
    if (fetched.length !== 0) {
      console.log(payload.password, fetched[0].password);

      if (
        payload.email === fetched[0].email ||
        payload.email === fetched[0].username
      ) {
        try {
          const match = await bcrypt.compare(
            payload.password,
            fetched[0].password
          );

          if (match) {
            data = {
              id: fetched[0].id,
              auth: "valid",
              username: fetched[0].username,
              role: fetched[0].role_fkid,
            };

            return data;
          } else {
            data = {
              id: fetched[0].id,
              auth: "wrong password",
            };

            return data;
          }
        } catch (error) {
          console.error("Error comparing passwords:", error);
          return "something went wrong -";
        }
      } else {
        return "something went wrong --";
      }
    } else {
      return "something went wrong ---"; // Handle the case where fetched is empty
    }
  },

  hashing: async (password) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },
};
