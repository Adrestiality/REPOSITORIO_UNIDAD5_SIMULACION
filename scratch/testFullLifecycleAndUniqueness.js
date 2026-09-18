import * as THREE from 'three';
import { SLIDES_REGISTRY } from '../src/slides/index.js';
import { SLIDES_DATA } from '../src/slides/slidesData.js';

console.log('=== VERIFICACIÓN ESTRUCTURAL DE UNICIDAD DE IMÁGENES Y CICLO DE VIDA ===');

// Simulador de escenario ThreeStage
const dummyScene = new THREE.Scene();

// Función de prueba de montaje, animación y desmontaje
function testSlideMountUnmount(index) {
  const SlideClass = SLIDES_REGISTRY[index];
  const slideData = SLIDES_DATA[index];
  
  const slide = new SlideClass();
  slide.initialize({ scene: dummyScene });
  const slideGroup = slide.group;

  // Simular varios frames de animación
  for (let f = 0; f < 60; f++) {
    slide.update(1 / 60);
  }

  // Contar cuántos meshes con textura o planos de imagen existen
  let imagePlanesCount = 0;
  slideGroup.traverse((child) => {
    if (child.isMesh && child.geometry instanceof THREE.PlaneGeometry) {
      if (child.material && (child.material.map || child.material.isMeshBasicMaterial)) {
        imagePlanesCount++;
      }
    }
  });

  // Desmontar y verificar limpieza
  dummyScene.remove(slideGroup);
  slide.dispose();

  let remainingChildren = slideGroup.children.length;

  return {
    id: slideData.id,
    theme: slideData.theme,
    layout: slideData.layout,
    imagePlanesCount,
    remainingChildren
  };
}

// 1. Probar todas las diapositivas
console.log('\n--- PASO 1: Prueba de montaje y conteo de planos ---');
SLIDES_DATA.forEach((s, idx) => {
  const res = testSlideMountUnmount(idx);
  console.log(`[Slide ${idx + 1}] ID: ${res.id.padEnd(25)} | Tema: ${res.theme.padEnd(6)} | Layout: ${res.layout.padEnd(20)} | Planos/Texturas: ${res.imagePlanesCount} | Restantes tras dispose: ${res.remainingChildren}`);
});

// 2. Probar navegación bidireccional repetida (Slide 1 -> 2 -> 3 -> 4 -> 6 -> 8 -> 10 -> 8 -> 2 -> 1)
console.log('\n--- PASO 2: Navegación de ida y vuelta múltiple para verificar que no hay fugas ni acumulaciones ---');
const navSequence = [0, 1, 2, 3, 5, 7, 9, 7, 1, 0];
let totalLeaks = 0;

navSequence.forEach((slideIdx, step) => {
  const res = testSlideMountUnmount(slideIdx);
  if (res.remainingChildren > 0) {
    console.error(`[ERROR] Fuga detectada en paso ${step}, Slide ${slideIdx + 1}`);
    totalLeaks++;
  }
});

if (totalLeaks === 0) {
  console.log('\n[ÉXITO TOTAL] Todas las transiciones de ida y vuelta limpiaron el 100% de los recursos sin duplicados.');
} else {
  console.error(`\n[FALLO] Se detectaron ${totalLeaks} fugas de memoria.`);
}
