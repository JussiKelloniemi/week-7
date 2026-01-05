"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
// import jwt, { JwtPayload } from 'jsonwebtoken'
const router = (0, express_1.Router)();
const users = [];
router.post("/register", (0, express_validator_1.body)("email").trim().escape(), (0, express_validator_1.body)("password"), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = users.find(user => user.email === req.body.email);
        console.log(existingUser);
        if (existingUser) {
            return res.status(403).json({ email: "email already in use" });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        const newUser = {
            email: req.body.email,
            password: hash
        };
        users.push(newUser);
        return res.status(200).json(newUser);
    }
    catch (error) {
        console.error(`Error during registration: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
router.get("/list", (req, res) => {
    const userList = users.map(user => ({
        email: user.email,
        password: user.password
    }));
    return res.status(200).json(userList);
});
exports.default = router;
