const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { catchAsyncError } = require("./middlewares/catchAsyncError");
const { default: ErrorHandler } = require("./middlewares/error");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "roxiler_store",
});

app.get("/", (req, res) => {
  return res.json("From Backend Side");
});

app.get(
  "/users",
  catchAsyncError(async (req, res, next) => {
    const sql = `SELECT * FROM users`;
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  })
);

app.post(
  "/create-account",
  catchAsyncError(async (req, res, next) => {
    const { name, address, email, password, role } = req.body;
    // const id = uuidv4();
    // const role = "user";

    const sql =
      "INSERT INTO users (name, address, email, password, role) VALUES ( ?, ?, ?, ?, ?)";
    const values = [name, address, email, password, role];

    db.query(sql, values, (err, data) => {
      if (err) return next(new ErrorHandler(err.ressponse.data), 401);

      // console.log(data);

      const user = { id: data.insertId, name, address, email, role };
      // console.log(user);

      if (role === "admin") return res.json({ user });

      const token = jwt.sign({ id: user.id, email: user.email }, "asdzxcqwe", {
        expiresIn: "24h",
      });
      return res.json({ user, token });
    });
  })
);

app.post(
  "/create-store",
  catchAsyncError(async (req, res, next) => {
    const { owner_id, store_name, store_email, store_address } = req.body;
    // const id = uuidv4();
    // const role = "user";

    const sql = `INSERT INTO store (owner_id, store_name, store_address, store_email) VALUES ( ?, ?, ?, ?)`;
    const values = [owner_id, store_name, store_address, store_email];

    db.query(sql, values, (err, data) => {
      if (err) {
        return next(new ErrorHandler(err.response), 401);
      }

      return res.status(200).json(data);
    });
  })
);

app.post(
  "/log-in",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Email and Password are Required", 400));
      }

      const sql = "SELECT * FROM users WHERE email = ? and password = ?";
      const values = [email, password];

      db.query(sql, values, (err, data) => {
        if (err) {
          console.log(err);

          return res.json(err);
        }
        if (data.length > 0) {
          console.log(data);

          const user = data[0];
          const token = jwt.sign(
            { id: user.id, email: user.email },
            "asdzxcqwe",
            {
              expiresIn: "24h",
            }
          );
          return res.status(200).json({ user, token });
        }
      });
    } catch (error) {
      return next(new ErrorHandler("Login Error", 400));
    }
  })
);

app.post(
  "/get-user/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        return next(new ErrorHandler("Id is Required", 400));
      }

      const sql = "SELECT * FROM users WHERE id=?";
      const values = [id];

      db.query(sql, values, (err, data) => {
        if (err) return res.json(err);
        if (data.length > 0) {
          const user = data[0];

          return res.status(200).json(user);
        }
      });
    } catch (error) {
      return next(new ErrorHandler("Login Error", 400));
    }
  })
);

app.put(
  "/update-password",
  catchAsyncError(async (req, res, next) => {
    const { id, oldPassword, newPassword } = req.body;

    const sql = "UPDATE users SET password = ? WHERE id = ?";
    const values = [newPassword, id];

    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({ error: err });
      if (data.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    });
  })
);

app.get(
  "/all-stores",
  catchAsyncError(async (req, res, next) => {
    try {
      const sql = `SELECT * FROM store`;

      db.query(sql, (err, data) => {
        if (err)
          return next(new ErrorHandler("Store Data Fetching Query Error", 401));
        return res.status(200).json(data);
      });
    } catch (error) {
      return next(
        new ErrorHandler("Error While Fetching All Stores Data", 400)
      );
    }
  })
);

app.put(
  "/update-role",
  catchAsyncError(async (req, res, next) => {
    const { id, role } = req.body;

    const sql = "UPDATE users SET role = ? WHERE id = ?";
    const values = [role, id];

    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({ error: err });
      if (data.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(200).json({ message: "Role updated successfully." });
    });
  })
);

app.get(
  "/all-ratings",
  catchAsyncError(async (req, res, next) => {
    try {
      const sql = `SELECT * FROM rating`;

      db.query(sql, (err, data) => {
        if (err)
          return next(
            new ErrorHandler("All Rating Data Fetching Query Error", 401)
          );
        return res.status(200).json(data);
      });
    } catch (error) {
      return next(
        new ErrorHandler("Error While Fetching All Rating Data", 400)
      );
    }
  })
);

app.get(
  "/store/:storeId/ratings",
  catchAsyncError(async (req, res, next) => {
    const { storeId } = req.params;

    try {
      const sql = `SELECT DISTINCT users.id, users.name, users.email, rating.rating
         FROM users
         JOIN rating ON users.id = rating.user_id
         WHERE rating.store_id = ?`;
      db.query(sql, [storeId], (err, data) => {
        if (err) {
          console.log(err);

          return next(
            new ErrorHandler("All Rating Data Fetching Query Error", 401)
          );
        }
        return res.status(200).json(data);
      });
    } catch (error) {
      console.error("Error fetching raters:", error);
      res.status(500).send("Internal server error");
    }
  })
);

app.get(
  "/get-store-data/:userId",
  catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    try {
      const sql = `select * from store where owner_id=?`;
      db.query(sql, [userId], (err, data) => {
        if (err)
          return next(new ErrorHandler("Error while fetching store data", 401));
        return res.status(200).json(data);
      });
    } catch (error) {
      return next(new ErrorHandler("Error while fetching store data", 401));
    }
  })
);

app.get("/update-store-info", (req, res) => {
  // Update avg_rating query
  const avgRatingQuery = `
    UPDATE store s
    JOIN (
        SELECT store_id, ROUND(AVG(rating), 2) AS avg_rating
        FROM rating
        GROUP BY store_id
    ) r ON s.store_id = r.store_id
    SET s.avg_rating = r.avg_rating;
  `;

  // Update total_reviews query
  const totalReviewsQuery = `
    UPDATE store s
    JOIN (
        SELECT store_id, COUNT(*) AS total_reviews
        FROM rating
        GROUP BY store_id
    ) r ON s.store_id = r.store_id
    SET s.total_reviews = r.total_reviews;
  `;

  // Run both queries
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Transaction initiation failed" });
    }

    // Run the first query (avg_rating update)
    db.query(avgRatingQuery, (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.log(err);
          res.status(500).json({ error: "Failed to update avg_rating" });
        });
      }

      // Run the second query (total_reviews update)
      db.query(totalReviewsQuery, (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.log(err);
            res.status(500).json({ error: "Failed to update total_reviews" });
          });
        }

        // Commit the transaction if both queries succeed
        db.commit((err, data) => {
          if (err) {
            return db.rollback(() => {
              console.log(err);
              res.status(500).json({ error: "Transaction commit failed" });
            });
          }
          // console.log("Both updates completed successfully");
          res.status(200).json(data);
        });
      });
    });
  });
});

app.post(
  "/new-rating",
  catchAsyncError(async (req, res, next) => {
    const { rating, user_id, store_id } = req.body;

    const sql = `INSERT INTO rating (store_id, user_id, rating) VALUES(?,?,?)`;
    const values = [store_id, user_id, rating];

    db.query(sql, values, (err, data) => {
      if (err)
        return next(new ErrorHandler("Error while fetching store data", 401));
      return res.status(200).json(data);
    });
  })
);

app.put(
  "/edit-rating",
  catchAsyncError(async (req, res, next) => {
    const { rating, user_id, store_id } = req.body;

    const sql = `UPDATE rating SET rating = ? WHERE user_id = ? AND store_id = ?`;
    const values = [rating, user_id, store_id];

    db.query(sql, values, (err, data) => {
      if (err)
        return next(new ErrorHandler("Error while fetching store data", 401));
      return res.status(200).json(data);
    });
  })
);

app.listen(8080, () => {
  console.log("Server Listening");
});
