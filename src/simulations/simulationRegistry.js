/**
 * Simulation Registry
 * Registro y fábrica de las 13 simulaciones modulares.
 */
import { Slide01Simulation } from './Slide01Simulation.js';
import { Slide02Simulation } from './Slide02Simulation.js';
import { Slide03Simulation } from './Slide03Simulation.js';
import { Slide04Simulation } from './Slide04Simulation.js';
import { Slide05Simulation } from './Slide05Simulation.js';
import { Slide06Simulation } from './Slide06Simulation.js';
import { Slide07Simulation } from './Slide07Simulation.js';
import { Slide08Simulation } from './Slide08Simulation.js';
import { Slide09Simulation } from './Slide09Simulation.js';
import { Slide10Simulation } from './Slide10Simulation.js';
import { Slide11Simulation } from './Slide11Simulation.js';
import { Slide12Simulation } from './Slide12Simulation.js';
import { Slide13Simulation } from './Slide13Simulation.js';

export const SIMULATION_MAP = {
  0: Slide01Simulation,
  1: Slide02Simulation,
  2: Slide03Simulation,
  3: Slide04Simulation,
  4: Slide05Simulation,
  5: Slide06Simulation,
  6: Slide07Simulation,
  7: Slide08Simulation,
  8: Slide09Simulation,
  9: Slide10Simulation,
  10: Slide11Simulation,
  11: Slide12Simulation,
  12: Slide13Simulation
};

export class SimulationManager {
  constructor(threeStage, stateManager) {
    this.threeStage = threeStage;
    this.stateManager = stateManager;
    this.instances = new Map();
    this.currentSimulation = null;
    this.currentSlideIndex = -1;
  }

  getSimulation(index) {
    if (!this.instances.has(index)) {
      const SimClass = SIMULATION_MAP[index] || Slide01Simulation;
      this.instances.set(index, new SimClass());
    }
    return this.instances.get(index);
  }

  setSlide(slideIndex) {
    if (this.currentSlideIndex === slideIndex) return;

    // Guardar estado de la simulación anterior antes de desmontarla
    if (this.currentSimulation) {
      const prevSlideId = this.currentSimulation.id;
      const serializableState = this.currentSimulation.getSerializableState();
      this.stateManager.setSimulationState(prevSlideId, serializableState);
    }

    this.currentSlideIndex = slideIndex;
    const sim = this.getSimulation(slideIndex);
    this.currentSimulation = sim;

    // Restaurar estado guardado si existía
    const savedState = this.stateManager.getSimulationState(sim.id);
    if (savedState) {
      sim.applyState(savedState);
    }

    this.threeStage.setActiveSimulation(sim);
  }

  dispose() {
    this.instances.forEach((sim) => sim.dispose());
    this.instances.clear();
    this.currentSimulation = null;
  }
}
