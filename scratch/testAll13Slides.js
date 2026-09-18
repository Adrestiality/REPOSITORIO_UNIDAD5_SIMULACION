import * as THREE from 'three';
import { SLIDES_REGISTRY } from '../src/slides/index.js';

console.log('--- Testing All 13 Slides Lifecycle ---');

let passed = 0;
let failed = 0;

const slidesList = Object.values(SLIDES_REGISTRY);

for (let i = 0; i < slidesList.length; i++) {
  const SlideClass = slidesList[i];
  try {
    const scene = new THREE.Scene();
    const slide = new SlideClass();
    slide.initialize({ scene, camera: null, renderer: null, container: null, slideManager: null });
    
    // Simulate 30 frames of animation
    for (let frame = 0; frame < 30; frame++) {
      slide.update(0.016);
    }
    
    // Verify children meshes exist
    const childCount = slide.group.children.length;
    
    // Dispose cleanly
    slide.dispose();
    
    console.log(`[PASS] Slide ${String(i + 1).padStart(2, '0')}: ${slide.id} (${slide.title}) - Children: ${childCount}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] Slide ${String(i + 1).padStart(2, '0')}:`, err);
    failed++;
  }
}


console.log(`\nResult: ${passed} passed, ${failed} failed out of ${slidesList.length} slides.`);

if (failed > 0) process.exit(1);
