import { Request, Response } from "express";
import { user } from "../models/user";
import { color } from "../models/colors";


export const addColor = async (req: Request, res: Response) => {
    try {
        const colorData = req.body;

        if(!colorData) {
            return res.status(404).json({
                message: "Something went wrong in colorData"
            })
        }

        const userName = colorData.username;
        const colorHex = colorData.colorHex;

        const newUser = await user.create({
            username:userName,
        })

        await newUser.save();

        const newColors = await color.create({
            colors:colorHex,
        })

        await newColors.save();
        
    } catch (error) {
        console.error("something went wrong in addColor", error)
        return res.status(500).json({
            message: "error in internal server, error adding color"
        })
    }
}
