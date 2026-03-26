/* MachineActions.js (ex-UseCases) */
class CreateMachineAction {
  constructor(machineService) { this.machineService = machineService; }
  async execute(dto) { return this.machineService.createMachine({ name: dto.name, type: dto.type, capacity: dto.capacity, unit: dto.unit, consumables: dto.consumables, state: 'disponible', lastUsed: new Date(), lastCleaned: new Date() }); }
}
class GetMachinesAction { constructor(machineService) { this.machineService = machineService; }
  async execute() { return this.machineService.getAllMachines(); }
}
class GetMachineAction { constructor(machineService) { this.machineService = machineService; }
  async execute(id) { return this.machineService.getMachineById(id); }
}
class UpdateMachineAction { constructor(machineService) { this.machineService = machineService; }
  async execute(id, dto) { return this.machineService.updateMachine(id, dto.data); }
}
class DeleteMachineAction { constructor(machineService) { this.machineService = machineService; }
  async execute(id) { return this.machineService.deleteMachine(id); }
}
class UseMachineAction { constructor(machineService) { this.machineService = machineService; }
  async execute(id, dto) { return this.machineService.useMachine(id, dto.quantity); }
}
class CleanMachineAction { constructor(machineService) { this.machineService = machineService; }
  async execute(id) { return this.machineService.cleanMachine(id); }
}
class SetMachineStateAction { constructor(machineService) { this.machineService = machineService; }
  async execute(id, dto) { return this.machineService.setMachineState(id, dto.state); }
}
module.exports = {
  CreateMachineAction,
  GetMachinesAction,
  GetMachineAction,
  UpdateMachineAction,
  DeleteMachineAction,
  UseMachineAction,
  CleanMachineAction,
  SetMachineStateAction
};