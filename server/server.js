const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const pgp = require("pg-promise")();
const SECRET = "fethbgiupdcvntzu";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const db = pgp({
  user: "postgres",
  host: "localhost",
  database: "najmovi",
  password: "1234",
  port: 5432,
});

const getIDFromAccessToken = async (request) => {
  let id = null;
  const token = request.headers.access_token;
  jwt.verify(token, SECRET, async (error, decode) => {
    if (error) {
      throw error;
    } else {
      id = decode;
    }
  });
  return id;
};

//logger init
const logger = (req, res, next) => {
  if (req.headers.access_token === undefined) {
    return res.status(401).json({
      message: "UNAUTHORIZED ACTION",
    });
  } else {
    jwt.verify(req.headers.access_token, SECRET, (error, decode) => {
      if (error) {
        return res.status(401).json({
          message: "UNAUTHORIZED ACTION",
        });
      } else {
        next();
      }
    });
  }
};

app.get("/", function (req, res) {});

app.get("/korisnik", logger, async (req, res) => {
  try {
    const userID = await getIDFromAccessToken(req);
    const results = await db.any(
      "SELECT * FROM korisnik WHERE id_korisnik=$1",
      [userID]
    );
    res.status(200).json(results[0]);
  } catch (error) {
    return res.status(401).json({
      message: "UNAUHTORIZED ACTION",
    });
  }
});

app.get("/objekt", logger, async (req, res) => {
  try {
    const ugovori = await db.any(
      "SELECT id_objekt,cijena,adresa,postanski_broj,naziv,ime_prezime, email from ugovor u INNER JOIN objekt o ON u.objekt = o.id_objekt INNER JOIN vrsta_objekta vo ON o.vrsta_objekta = vo.id_vrsta_objekta INNER JOIN korisnik kor ON o.vlasnik = kor.id_korisnik where najmoprimac IS null"
    );
    res.status(200).json(ugovori);
    console.log(ugovori);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "UNAUTHORIZED ACTION",
    });
  }
});

app.post("/objekt", logger, async (req, res) => {
  const noviUgovor = req.body;
  const id = await getIDFromAccessToken(req);
  try {
    const noviObjektid = await db.func("dodavanje_objekta", [
      noviUgovor.adresa,
      noviUgovor.postanski_broj,
      parseInt(noviUgovor.vrsta_objekta),
      id,
    ]);
    await db.any(
      "INSERT INTO ugovor VALUES (default, null, $1, null, null, $2)",
      [noviObjektid[0].dodavanje_objekta, noviUgovor.cijena]
    );
    res.status(200).json({
      message: "USER_REGISTER_SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "USER_REGISTER_FAILED",
    });
  }
});

app.post("/unajmi", logger, async (req, res) => {
  const unajmiObjekt = req.body.objektID;
  const userID = await getIDFromAccessToken(req);
  const today = Date.now();
  const formatedDate = new Date(today);

  const krajUgovora = today + 1555200050;
  const formatedDate2 = new Date(krajUgovora);

  const datePocetak =
    formatedDate.getFullYear() +
    "-" +
    formatedDate.getMonth() +
    1 +
    "-" +
    formatedDate.getDate();
  const dateKraj =
    formatedDate2.getFullYear() +
    "-" +
    formatedDate2.getMonth() +
    1 +
    "-" +
    formatedDate2.getDate();

  try {
    await db.any(
      "UPDATE ugovor SET najmoprimac = $1, datum_pocetka = $2, datum_kraja = $3 where objekt = CAST($4 AS uuid)",
      [userID, datePocetak, dateKraj, unajmiObjekt]
    );
    res.status(200).json({
      message: "USER_REGISTER_SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "USER_REGISTER_FAILED",
    });
  }
});

app.get("/ugovori/dugovanja", logger, async (req, res) => {
  try {
    const userID = await getIDFromAccessToken(req);
    const ugovori = await db.any(
      "SELECT id_ugovor, adresa, datum_pocetka, datum_kraja, postanski_broj, naziv, ime_prezime, email, u.cijena FROM ugovor u INNER JOIN objekt ON id_objekt = objekt INNER JOIN vrsta_objekta ON vrsta_objekta = id_vrsta_objekta INNER JOIN korisnik ON id_korisnik = vlasnik WHERE najmoprimac=$1",
      [userID]
    );
    res.status(200).json(ugovori);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "UNAUTHORIZED ACTION",
    });
  }
});

app.get("/test", async (req, res) => {
  const dbRes = await db.func("test_json2", [2]);
  console.log(dbRes);
});

app.get("/ugovori/najmovi", logger, async (req, res) => {
  try {
    const userID = await getIDFromAccessToken(req);
    const ugovori = await db.any(
      "SELECT id_ugovor, adresa, datum_pocetka, datum_kraja, postanski_broj, naziv, ime_prezime, email, u.cijena FROM ugovor u INNER JOIN objekt ON id_objekt = objekt INNER JOIN vrsta_objekta ON vrsta_objekta = id_vrsta_objekta INNER JOIN korisnik ON id_korisnik = vlasnik WHERE vlasnik=$1",
      [userID]
    );
    console.log(ugovori);
    res.status(200).json(ugovori);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "UNAUTHORIZED ACTION",
    });
  }
});

app.post("/login", async (request, response) => {
  const userCredentials = request.body;
  try {
    const results = await db.any(
      "SELECT * FROM korisnik WHERE email = $1 AND lozinka = $2",
      [userCredentials.email, userCredentials.password]
    );
    if (results.length > 0) {
      const accessToken = jwt.sign(results[0].id_korisnik, SECRET);
      response.status(200).json({
        token: accessToken,
        user: results[0].ime_prezime,
      });
    } else {
      response.status(401).json({
        message: "WRONG CREDENTIALS",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "SERVER_ERROR",
    });
  }
});

app.post("/register", async (request, response) => {
  const newUser = request.body;
  try {
    const results = await db.any(
      "INSERT INTO korisnik VALUES (default, $1, $2, $3, $4, $5)",
      [
        newUser.ime_prezime,
        newUser.datum_rodenja.split("T")[0],
        newUser.mobitel,
        newUser.email,
        newUser.lozinka,
      ]
    );
    response.status(200).json({
      message: "USER_REGISTER_SUCCESS",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "USER_REGISTER_FAILED",
    });
  }
});

app.post("/rezije", async (request, response) => {
  console.log(request.body);
  const today = new Date();
  const formattedDate = today.toISOString().substring(0, 10);

  try {
    const results = await db.any(
      "INSERT INTO rezije VALUES (default, $1, $2)",
      [
        { datum: formattedDate, rezije: request.body.rezije },
        request.body.idObjekta,
      ]
    );
    response.status(200).json({
      message: "USER_REGISTER_SUCCESS",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "USER_REGISTER_FAILED",
    });
  }
});

app.post("/dohvati/rezije", async (request, response) => {
  try {
    const results = await db.any("SELECT * FROM rezije WHERE id_ugovor = $1", [
      request.body.id_ugovor,
    ]);
    response.status(200).json(results);
  } catch (error) {
    response.status(500).json({
      message: "SERVER_ERROR",
    });
  }
});

app.listen(3001);
