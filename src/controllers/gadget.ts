import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { gadgets } from '../models/models';
import { db } from '../config/database';
import { generateCodename, generateConfirmationCode, generateStatus, generateSuccessProbability } from '../actions/actions';
import { eq } from 'drizzle-orm';
import { statusEnum } from '../config/types';


const getGadgets = async (req: Request, res: Response) => {
    let { status } = req.query;
    type Status = (typeof statusEnum)[number];

    try {
        // if status is provided, filter gadgets by status
        if (status !== undefined) {
            if (typeof status === 'string' && statusEnum.includes(status as Status)) {
                const validStatus: Status = status as Status;
                // fetch gadgets with the provided status filter
                const result = await db.select().from(gadgets).where(eq(gadgets.status, validStatus));
                console.log('Gadgets retrieved successfully with status:', validStatus);
                res.status(200).json(result);
                return
            } else {
                res.status(400).json({ error: "Invalid status value, possible values are [Available, Deployed, Destroyed, Decommissioned]" });
                return
            }
        }
        // if status is not provided, return all gadgets with success probability
        const result = await db.select().from(gadgets)
        if (result.length === 0) {
            res.status(404).json({ message: 'No gadgets found' });
            return
        }
        const gadgetsWithProbability = result.map(gadget => ({
            ...gadget,
            missionSuccessProbability: `${generateSuccessProbability()}%`
        }));
        console.log('Gadgets retrieved successfully');
        res.status(200).json(gadgetsWithProbability);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving gadgets' });
    }
}

const addGadget = async (req: Request, res: Response) => {
    try {
        const name = generateCodename();
        const status = generateStatus();

        await db.insert(gadgets).values({ name, status });
        console.log('Gadget created successfully, name:', name, 'status:', status);
        res.status(201).json({ message: 'Gadget created successfully', gadget: { name, status } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating gadget' });
    }
}

const patchGadget = async (req: Request, res: Response) => {
    const { id } = req.params;
    let { name, status } = req.body;
    type Status = (typeof statusEnum)[number];
    try {
        if (status !== undefined) {
            if (statusEnum.includes(status)) {
                status = status as Status;
            } else {
                res.status(400).json({ error: "Invalid status value, possible values are [Available, Deployed, Destroyed, Decommissioned]" });
                return
            }
        }
        const result = await db.update(gadgets).set({ name, status }).where(eq(gadgets.id, parseInt(id))).returning();
        if (result.length === 0) {
            res.status(404).json({ message: 'Gadget not found' });
            return
        }
        console.log('Gadget updated successfully, new entries:', name, status);
        res.status(200).json({ message: 'Gadget updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating gadget' });
    }
}

const deleteGadget = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await db.update(gadgets).set({ status: 'Decommissioned', decommissioned_at: new Date() }).where(eq(gadgets.id, parseInt(id))).returning();

        if (result.length === 0) {
            res.status(404).json({ message: 'Gadget not found' });
            return
        }

        console.log('Gadget decommissioned successfully, id :', result[0].id);
        res.status(200).json({
            message: 'Gadget decommissioned',
            gadget: result[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error decommissioning gadget' });
    }
}

const selfDestruct = async (req: Request, res: Response) => {
    const confirmationCode = generateConfirmationCode();
    res.status(200).json({
        message: 'Self-destruct sequence initiated',
        confirmationCode,
        instructions: 'Enter this code to confirm destruction'
    });
}

export { getGadgets, addGadget, patchGadget, deleteGadget, selfDestruct }

