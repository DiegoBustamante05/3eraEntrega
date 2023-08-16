import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

import { connect } from "mongoose";
export async function connectMongo() {
  try {
    await connect(enviroment.MONGO_URL);
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}

import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);


export const enviroment = {mode: process.argv[2]}

import dotenv from 'dotenv';

if(process.argv[2] !='DEV' && process.argv[2] !='PROD') {
  console.log("argument must be PROD or DEV");
  process.exit();
}
dotenv.config({
  path: process.argv[2] === 'DEV' ? './.env.development' : './.env.production',
});


enviroment.PORT = process.env.PORT;
enviroment.MONGO_URL = process.env.MONGO_URL

