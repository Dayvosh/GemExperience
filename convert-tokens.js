/**
 * convert-tokens.js
 * -----------------------------------------------------------------------------
 * Converts `design-tokens.tokens.json` into a standard CSS variables file (`design-tokens.css`).
 *
 * Architecture & Best Practices:
 * 1. Primitive Colors (`--primitive-*`): Lower-level foundational color palette tokens.
 *    These represent raw hex/rgba values and MUST NOT be used directly in UI components.
 * 2. Color Roles (`--color-*`): Semantic color tokens mapped via `var(--primitive-*)`.
 *    These MUST be consumed directly by UI components, enforcing color role separation
 *    and making `design-tokens.tokens.json` the single source of truth.
 * 3. Effect Tokens (`--effect-*`): Shadow and drop-shadow definitions.
 * 4. Typography Tokens (`--typography-*`): Font sizes, line heights, weights, and metrics.
 */

const fs = require('fs');
const path = require('path');

// CLI Arguments or default paths
const inputPath = process.argv[2] || path.join(__dirname, 'design-tokens.tokens.json');
const outputPath = process.argv[3] || path.join(__dirname, 'design-tokens.css');

/**
 * Converts camelCase / spaced strings into kebab-case.
 * @param {string} str
 * @returns {string}
 */
function toKebabCase(str) {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Formats hex colors (converts 8-digit hex ending in "ff" to 6-digit hex).
 * @param {string} hex
 * @returns {string}
 */
function formatColor(hex) {
  if (typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  if (hex.length === 9 && hex.toLowerCase().endsWith('ff')) {
    return hex.slice(0, 7);
  }
  return hex;
}

/**
 * Traverses JSON object to extract all leaf token nodes with their JSON path.
 * @param {object} obj
 * @param {Array<string>} pathArr
 * @returns {Array<{ path: Array<string>, pathStr: string, token: object }>}
 */
function getLeafTokens(obj, pathArr = []) {
  let results = [];
  for (const key in obj) {
    if (key === 'extensions') continue;
    const val = obj[key];
    if (val && typeof val === 'object') {
      if (val.value !== undefined) {
        results.push({
          path: [...pathArr, key],
          pathStr: [...pathArr, key].join('.'),
          token: val
        });
      } else {
        results = results.concat(getLeafTokens(val, [...pathArr, key]));
      }
    }
  }
  return results;
}

/**
 * Map JSON token path array to CSS custom property name.
 * @param {Array<string>} pathArr
 * @returns {string}
 */
function tokenPathToVarName(pathArr) {
  const category = pathArr[0];
  const subPath = pathArr.slice(1);

  if (category === 'primitives') {
    return `--primitive-${subPath.map(toKebabCase).join('-')}`;
  } else if (category === 'color roles') {
    return `--color-${subPath.map(toKebabCase).join('-')}`;
  } else if (category === 'effect') {
    return `--effect-${subPath.map(toKebabCase).join('-')}`;
  } else if (category === 'typography') {
    return `--typography-${subPath.map(toKebabCase).join('-')}`;
  }

  return `--${pathArr.map(toKebabCase).join('-')}`;
}

function convertTokensToCSS() {
  console.log(`Reading tokens from: ${inputPath}`);
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const tokensJSON = JSON.parse(rawData);

  const leafTokens = getLeafTokens(tokensJSON);
  const pathVarMap = new Map();

  // 1. Build lookup dictionary from JSON dot-path to CSS variable name
  leafTokens.forEach(item => {
    const varName = tokenPathToVarName(item.path);
    pathVarMap.set(item.pathStr, varName);
  });

  const cssLines = [];
  cssLines.push('/* ========================================================================== */');
  cssLines.push('/* DESIGN SYSTEM CSS VARIABLES                                                */');
  cssLines.push('/* Auto-generated from design-tokens.tokens.json - DO NOT EDIT DIRECTLY       */');
  cssLines.push('/* ========================================================================== */');
  cssLines.push('');
  cssLines.push(':root {');

  // 2. Primitive Colors Section
  const primitiveTokens = leafTokens.filter(l => l.path[0] === 'primitives');
  if (primitiveTokens.length > 0) {
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    cssLines.push('  /* PRIMITIVE COLORS (Foundational palette tokens - Do NOT use in UI code)   */');
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    primitiveTokens.forEach(item => {
      const varName = pathVarMap.get(item.pathStr);
      const formattedVal = formatColor(item.token.value);
      cssLines.push(`  ${varName}: ${formattedVal};`);
    });
    cssLines.push('');
  }

  // 3. Color Roles Section
  const colorRoleTokens = leafTokens.filter(l => l.path[0] === 'color roles');
  if (colorRoleTokens.length > 0) {
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    cssLines.push('  /* COLOR ROLES (Semantic tokens - USE THESE DIRECTLY IN UI COMPONENTS)       */');
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    colorRoleTokens.forEach(item => {
      const varName = pathVarMap.get(item.pathStr);
      let rawVal = item.token.value;
      let cssVal = '';

      if (typeof rawVal === 'string' && rawVal.startsWith('{') && rawVal.endsWith('}')) {
        const refPath = rawVal.slice(1, -1);
        const refVarName = pathVarMap.get(refPath);
        if (refVarName) {
          cssVal = `var(${refVarName})`;
        } else {
          console.warn(`Warning: Could not resolve token reference "${refPath}"`);
          cssVal = rawVal;
        }
      } else {
        cssVal = formatColor(rawVal);
      }

      cssLines.push(`  ${varName}: ${cssVal};`);
    });
    cssLines.push('');
  }

  // 4. Effect Tokens (Shadows)
  const effectTokens = leafTokens.filter(l => l.path[0] === 'effect');
  if (effectTokens.length > 0) {
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    cssLines.push('  /* EFFECT TOKENS (Box Shadows)                                              */');
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    effectTokens.forEach(item => {
      const varName = pathVarMap.get(item.pathStr);
      const val = item.token.value;
      let cssVal = '';
      if (typeof val === 'object' && val !== null) {
        const offsetX = val.offsetX !== undefined ? `${val.offsetX}px` : '0px';
        const offsetY = val.offsetY !== undefined ? `${val.offsetY}px` : '0px';
        const radius = val.radius !== undefined ? `${val.radius}px` : '0px';
        const spread = val.spread !== undefined ? `${val.spread}px` : '0px';
        const color = formatColor(val.color || '#000000');
        cssVal = `${offsetX} ${offsetY} ${radius} ${spread} ${color}`;
      } else {
        cssVal = val;
      }
      cssLines.push(`  ${varName}: ${cssVal};`);
    });
    cssLines.push('');
  }

  // 5. Typography Tokens
  const typographyTokens = leafTokens.filter(l => l.path[0] === 'typography');
  if (typographyTokens.length > 0) {
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    cssLines.push('  /* TYPOGRAPHY TOKENS                                                        */');
    cssLines.push('  /* ------------------------------------------------------------------------ */');
    typographyTokens.forEach(item => {
      const varName = pathVarMap.get(item.pathStr);
      let val = item.token.value;
      let cssVal = val;

      if (item.token.type === 'dimension' && typeof val === 'number') {
        cssVal = `${val}px`;
      } else if (item.path.includes('fontFamily') && typeof val === 'string') {
        cssVal = `"${val}", system-ui, sans-serif`;
      }

      cssLines.push(`  ${varName}: ${cssVal};`);
    });
    cssLines.push('');
  }

  cssLines.push('}');
  cssLines.push('');

  fs.writeFileSync(outputPath, cssLines.join('\n'), 'utf8');
  console.log(`Successfully generated CSS variables file at: ${outputPath}`);
  console.log(`Converted ${leafTokens.length} tokens (${primitiveTokens.length} primitives, ${colorRoleTokens.length} color roles, ${effectTokens.length} effects, ${typographyTokens.length} typography rules).`);
}

convertTokensToCSS();
