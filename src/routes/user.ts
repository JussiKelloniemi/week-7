import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
// import jwt, { JwtPayload } from 'jsonwebtoken'

const router: Router = Router()

interface UserData {
    email: string
    password: string
}

const users: UserData[] = []

router.post("/register",
    body("email").trim().escape(),
    body("password"),
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)

        if(!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({errors: errors.array()})
        }
    
    try {
        const existingUser = users.find(user => user.email === req.body.email)
        console.log(existingUser)
        if (existingUser) {
            return res.status(403).json({email: "email already in use"})
        }

        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        users.push({
            email: req.body.email,
            password: hash
        })

        return res.status(200).json({messsage: "User registered successfully"})
    } catch(error: any) {
        console.error(`Error during registration: ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    }
    }
)

router.get("/list", (req: Request, res: Response) => {
    const userList = users.map(user => ({
        email: user.email,
        password: user.password
    }))
    return res.status(200).json(userList)
})

export default router