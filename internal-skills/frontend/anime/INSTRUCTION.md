---
name: anime
description: Anime.js animation engine - light, powerful, timeline-based Javascript animation library. Use for UI/web micro-animations, SVG paths, morphing, and complex transitions.
---

# Anime.js Animation Skill

Use this skill when you need to write animations using Anime.js (juliangarnier/anime).

## Core API Usage

```javascript
import anime from 'animejs/lib/anime.es.js';

// Basic tween
anime({
  targets: '.dom-node',
  translateX: 250,
  rotate: '1turn',
  backgroundColor: '#FFF',
  duration: 800
});
```

## Key Features

1. **Targets**: CSS selectors, DOM nodes, NodeList, JS objects, or Arrays.
2. **Properties**: CSS properties, Individual transforms, SVG attributes, DOM properties, Object properties.
3. **Timeline**: Control multiple animations sequentially or overlap them.
   ```javascript
   var tl = anime.timeline({
     easing: 'easeOutExpo',
     duration: 750
   });
   tl.add({ targets: '.el1', translateX: 250 })
     .add({ targets: '.el2', translateY: 250 }, '-=600'); // relative offset
   ```
4. **SVG Morphing**: Animate SVG shapes.
5. **Staggering**: Animate multiple elements with follow-through delays.

## Best Practices
- Keep animations smooth by targetting `transform` (scale, rotate, translate) and `opacity` where possible to utilize GPU acceleration.
- Use timelines instead of overlapping setTimeouts for complex sequence orchestration.
