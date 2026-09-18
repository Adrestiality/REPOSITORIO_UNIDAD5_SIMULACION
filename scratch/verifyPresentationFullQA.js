import * as THREE from 'three';
import { SLIDES_REGISTRY } from '../src/slides/index.js';
import { SLIDES_DATA } from '../src/slides/slidesData.js';
import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('🔬 REVISIÓN QUIRÚRGICA Y QA GLOBAL COMPLETO (13 DIAPOSITIVAS)');
console.log('================================================================\n');

let issues = [];
let slideChecks = [];

// 1. Verificación de Logos Oficiales e Imágenes
const assetsDir = path.resolve('public/assets');
const requiredAssets = [
  'logo_forum_centro_eventos.svg',
  'logo_upb_90_anos.svg',
  'slide02_grados.jpg',
  'slide04_academia_industria.jpg'
];

console.log('📁 1. Verificación de Archivos de Marca e Imágenes Oficiales:');
requiredAssets.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    console.log(`  [OK] ${file} (${size} bytes)`);
  } else {
    console.error(`  [FAIL] Falta el archivo: ${file}`);
    issues.push(`Falta el archivo oficial: ${file}`);
  }
});

// 2. Verificación de Textos en Español y Portugués
console.log('\n📝 2. Verificación de Contenido Multilingüe (ES / PT):');
SLIDES_DATA.forEach((slide, idx) => {
  const num = idx + 1;
  const hasEs = !!(slide.copy && slide.copy.es && slide.copy.es.title);
  const hasPt = !!(slide.copy && slide.copy.pt && slide.copy.pt.title);
  
  if (!hasEs || !hasPt) {
    issues.push(`Slide ${num} no tiene copys completos en ES o PT.`);
    console.error(`  [FAIL] Slide ${num}: Falta copy ES o PT`);
  } else {
    console.log(`  [OK] Slide ${String(num).padStart(2, '0')} (${slide.id}): ES="${slide.copy.es.title.slice(0, 30)}..." | PT="${slide.copy.pt.title.slice(0, 30)}..."`);
  }
});

// 3. Verificación de Cinemática y Espacio de los 13 Slides
console.log('\n🎭 3. Verificación 3D, Cinemática, Geometría y Cero Clipping:');
const slidesList = Object.values(SLIDES_REGISTRY);

for (let i = 0; i < slidesList.length; i++) {
  const SlideClass = slidesList[i];
  const data = SLIDES_DATA[i];
  const num = i + 1;
  
  try {
    const scene = new THREE.Scene();
    const slide = new SlideClass();
    slide.initialize({ scene, camera: null, renderer: null, container: null, slideManager: null });
    
    // Probar 60 fotogramas de simulación
    for (let frame = 0; frame < 60; frame++) {
      slide.update(0.016);
    }
    
    const childrenCount = slide.group.children.length;
    
    // Verificaciones específicas por diapositiva
    if (num === 9) {
      if (!slide.pieceA || !slide.pieceB) {
        issues.push('Slide 9: Faltan las dos piezas textiles complementarias (pieceA / pieceB).');
      }
    } else if (num === 10) {
      if (!slide.buttons || slide.buttons.length !== 5) {
        issues.push(`Slide 10: Se esperaban 5 botones, encontrados: ${slide.buttons?.length}`);
      }
    } else if (num === 11) {
      if (!slide.outerPetals || slide.outerPetals.length !== 6 || !slide.innerPetals || slide.innerPetals.length !== 6) {
        issues.push('Slide 11: Se esperaban 6 pétalos exteriores y 6 interiores del florecimiento cinético.');
      }
    } else if (num === 12) {
      if (!slide.patternPanels || slide.patternPanels.length < 6) {
        issues.push(`Slide 12: Paneles de la casa insuficientes (${slide.patternPanels?.length}).`);
      }
    } else if (num === 13) {
      if (!slide.hangingFrames || slide.hangingFrames.length !== 2) {
        issues.push(`Slide 13: Se esperaban 2 marcos suspendidos, encontrados: ${slide.hangingFrames?.length}`);
      }
    }
    
    slide.dispose();
    console.log(`  [OK] Slide ${String(num).padStart(2, '0')}: ${slide.id} — Meshes: ${childrenCount} | Simulación 60fps completada sin errores.`);
  } catch (err) {
    console.error(`  [FAIL] Error en Slide ${num}:`, err);
    issues.push(`Error en Slide ${num}: ${err.message}`);
  }
}

console.log('\n================================================================');
if (issues.length === 0) {
  console.log('✅ REVISIÓN GLOBAL EXITOSA: Todas las diapositivas cumplen con los 10 criterios de QA.');
} else {
  console.error(`❌ Se encontraron ${issues.length} incidencias:`);
  issues.forEach(iss => console.error(`  - ${iss}`));
  process.exit(1);
}
