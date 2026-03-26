/**
 * Machine Controller - handles machine management and operations
 * Uses MachineService, DTOs, and UseCases for clean architecture
 */

const {
  CreateMachineDTO,
  UseMachineDTO,
  SetMachineStateDTO,
  UpdateMachineDTO
} = require('../dtos/MachineDTOs');
const {
  CreateMachineAction,
  GetMachinesAction,
  GetMachineAction,
  UpdateMachineAction,
  DeleteMachineAction,
  UseMachineAction,
  CleanMachineAction,
  SetMachineStateAction
} = require('../actions/MachineActions');
const { MachineService } = require('../services/MachineService');
const { MachineRepository } = require('../repositories/MachineRepository');
const Machine = require('../models/Machine');

/**
 * Creates a new machine (admin only).
 *
 * @param {import('express').Request} req - Request with { name, type, capacity, unit, consumables }
 * @param {import('express').Response} res - Response with created machine
 * @returns {void} 201 with machine created
 *
 * @swagger
 * /machine:
 *   post:
 *     summary: Create a new machine
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               capacity:
 *                 type: number
 *               unit:
 *                 type: string
 *     responses:
 *       201:
 *         description: Machine created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
exports.createMachine = async (req, res) => {
  try {
    const dto = new CreateMachineDTO(
      req.body.name,
      req.body.type,
      req.body.capacity,
      req.body.unit,
      req.body.consumables
    );
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new CreateMachineUseCase(service);

    const result = await useCase.execute(dto);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Returns list of all machines with populated consumables.
 *
 * @param {import('express').Request} req - Request
 * @param {import('express').Response} res - Response with machines list
 * @returns {void} 200 with machines array
 *
 * @swagger
 * /machine:
 *   get:
 *     summary: Get all machines
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of machines
 *       500:
 *         description: Server error
 */
exports.getMachines = async (req, res) => {
  try {
    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new GetMachinesUseCase(service);

    const machines = await useCase.execute();
    res.json(machines);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Returns a specific machine by ID.
 *
 * @param {import('express').Request} req - Request with req.params.id
 * @param {import('express').Response} res - Response with machine
 * @returns {void} 200 with machine, 404 if not found
 *
 * @swagger
 * /machine/{id}:
 *   get:
 *     summary: Get machine by ID
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Machine found
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Server error
 */
exports.getMachine = async (req, res) => {
  try {
    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new GetMachineUseCase(service);

    const machine = await useCase.execute(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine non trouvée' });
    }
    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Updates a machine by ID (admin only).
 *
 * @param {import('express').Request} req - Request with req.params.id and body to update
 * @param {import('express').Response} res - Response with updated machine
 * @returns {void} 200 with updated machine, 404 if not found
 *
 * @swagger
 * /machine/{id}:
 *   patch:
 *     summary: Update machine
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Machine updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Server error
 */
exports.updateMachine = async (req, res) => {
  try {
    const dto = new UpdateMachineDTO(req.body);
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new UpdateMachineUseCase(service);

    const machine = await useCase.execute(req.params.id, dto);
    if (!machine) {
      return res.status(404).json({ error: 'Machine non trouvée' });
    }
    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Deletes a machine by ID (admin only).
 *
 * @param {import('express').Request} req - Request with req.params.id
 * @param {import('express').Response} res - Confirmation message
 * @returns {void} 200 if deleted, 404 if not found
 *
 * @swagger
 * /machine/{id}:
 *   delete:
 *     summary: Delete machine
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Machine deleted
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Server error
 */
exports.deleteMachine = async (req, res) => {
  try {
    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new DeleteMachineUseCase(service);

    const machine = await useCase.execute(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine non trouvée' });
    }
    res.json({ message: 'Machine supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Uses a machine to prepare servings.
 * Updates lastUsed. Consumable decrement should be implemented in service layer.
 *
 * @param {import('express').Request} req - Request with req.params.id and { quantity, AuteurId }
 * @param {import('express').Response} res - Response with updated machine
 * @returns {void} 200 on success, 400 if unavailable or capacity exceeded
 *
 * @swagger
 * /machine/{id}/use:
 *   post:
 *     summary: Use a machine
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *               AuteurId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Machine used successfully
 *       400:
 *         description: Invalid use or insufficient capacity
 *       403:
 *         description: Machine not available
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Server error
 */
exports.useMachine = async (req, res) => {
  try {
    const dto = new UseMachineDTO(req.body.quantity, req.body.AuteurId);
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new UseMachineUseCase(service);

    const machine = await useCase.execute(req.params.id, dto);
    res.json({ message: 'Préparation effectuée', machine });
  } catch (err) {
    if (err.message && err.message.includes('non disponible')) {
      return res.status(403).json({ error: err.message });
    }
    if (err.message && err.message.includes('Capacité dépassée')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message && err.message.includes('non trouvée')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Marks a machine as being cleaned.
 * Updates lastCleaned and state to "en nettoyage".
 *
 * @param {import('express').Request} req - Request with req.params.id
 * @param {import('express').Response} res - Response with updated machine
 * @returns {void} 200 on success, 404 if not found
 *
 * @swagger
 * /machine/{id}/clean:
 *   post:
 *     summary: Mark machine as being cleaned
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Machine marked as cleaning
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Server error
 */
exports.cleanMachine = async (req, res) => {
  try {
    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new CleanMachineUseCase(service);

    const machine = await useCase.execute(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine non trouvée' });
    }
    res.json({ message: 'Machine en nettoyage', machine });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Changes machine state (disponible, en panne, en nettoyage, etc.).
 * Reserved for admins.
 *
 * @param {import('express').Request} req - Request with req.params.id and { state }
 * @param {import('express').Response} res - Response with updated machine
 * @returns {void} 200 on success, 404 if not found
 *
 * @swagger
 * /machine/{id}/state:
 *   patch:
 *     summary: Set machine state
 *     tags:
 *       - Machine
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [disponible, en panne, en nettoyage, maintenance]
 *     responses:
 *       200:
 *         description: State updated
 *       400:
 *         description: Invalid state
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Server error
 */
exports.setMachineState = async (req, res) => {
  try {
    const dto = new SetMachineStateDTO(req.body.state);
    const validation = dto.validate();
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const repository = new MachineRepository(Machine);
    const service = new MachineService(repository);
    const useCase = new SetMachineStateUseCase(service);

    const machine = await useCase.execute(req.params.id, dto);
    if (!machine) {
      return res.status(404).json({ error: 'Machine non trouvée' });
    }
    res.json({ message: 'État mis à jour', machine });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
