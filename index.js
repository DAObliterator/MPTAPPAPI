import express, { query } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./database/db";
dotenv.config({ path: "./config.env" });
import jwt from "jsonwebtoken";
import bcrytp from "bcryptjs";
import { addDoc, collection } from "firebase/firestore";
import { where } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { TaskRouter } from "./routes/tasks.js";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET , PUT , POST , DELETE",
    credentials: true,
  })
);
app.use("/tasks", TaskRouter);

app.get("/", (req, res) => {
  console.log(`hello !!!!`);
  res.send("<h1>Hello</h1>");
});

app.post("/register", async (req, res) => {

  console.log(
    JSON.stringify(req.body),
    "You have hit the register endpoint with a post request"
  );

  const { username, password, role } = req.body;

  //create the user in firestore
  bcrytp.genSalt(10, (err, salt) => {
    bcrytp.hash(password, salt, async (err, hash) => {
      if (err) throw err;

      try {
        const docRef = await addDoc(collection(db, "users"), {
          username,
          password: hash,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log("Document written with ID: ", docRef.id);
        res.status(200).send("User created successfully");
      } catch (error) {
        res.status(500).json({ message: "Error creating user!!"});
      }

    });

   
  });
});

app.post("/login", async (req, res) => {
  console.log(
    JSON.stringify(req.body),
    "You have hit the login endpoint with a post request"
  );

  const { username, password } = req.body;
  let hash = "";
  let role = "";

  const q = query(collection(db, "users"), where("username", "==", username));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return res.status(401).send("Invalid credentials");
  }else {
    querySnapshot.forEach((doc) => {
      hash = doc.data().password;
      role = doc.data().role;
    });
  }

  bcrytp.compare(password , hash , (err , result) => {
    if(err) throw err;

    if(result){
      jwt.sign({username , role} , process.env.JWT_SECRET , {expiresIn : "1d" ,algorithm: "RS256"} , (err , token) => {
        if(err) throw err;
        res.status(200).json({ token});
      })

      res.status(200).send("Login successful");
    }else{
      res.status(401).send("Invalid credentials");
    }
  })
})

app.post("/reportAComplaint" , (req ,res) => {



});

const PORT = process.env.PORT || 6008;

app.listen(PORT, () => {
  console.log(`App running on ${PORT} \n`);
});
