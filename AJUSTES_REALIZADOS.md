# Ajustes Realizados en la Landing Page de Terrasacha

**Fecha:** Enero 2025  
**Proyecto:** Terrasacha Web - Landing Page

---

## 📋 Resumen de Cambios

Este documento detalla todos los ajustes y mejoras implementadas en la landing page del proyecto Terrasacha durante esta sesión de desarrollo.

---

## 1. 🔧 Corrección del Botón Flotante "Contáctanos"

### Problema Identificado
- El botón flotante funcionaba en móvil pero no en computador
- Se usaba `window.location.href` que no era confiable en todos los navegadores

### Solución Implementada
- Se cambió de `<button>` con `onClick` a un `<a>` directo con `href="mailto:..."`
- Ahora funciona correctamente en todos los dispositivos
- El enlace abre el cliente de correo predeterminado con el email `terrasachasocial@gmail.com`

**Archivo modificado:**
- `src/components/ContactButton.tsx`

**Cambios técnicos:**
```tsx
// Antes: <button onClick={handleContact}>
// Ahora: <a href="mailto:terrasachasocial@gmail.com?subject=...">
```

---

## 2. 🎨 Rediseño de la Sección "Formación Continua"

### Cambios Visuales

#### Primera Iteración (Fondo de Bosque)
- Se añadió fondo de imagen de bosque (`Bosque drones IoT Satelites 2.webp`)
- Overlay verde con gradiente para mantener legibilidad
- Textos en color crema (`#f6f0d0`) para contraste sobre fondo oscuro
- Card principal con fondo semi-transparente verde oscuro

#### Segunda Iteración (Fondo Limpio - Solicitado)
- Se removió completamente el fondo de bosque
- Fondo degradado suave: `from-white to-secondary-claro/15`
- Elementos decorativos sutiles (círculos difuminados)
- Textos ajustados a colores oscuros para fondo claro

**Archivo modificado:**
- `src/components/TrainingSection.tsx`

**Características del nuevo diseño:**
- Fondo degradado blanco → verde claro
- Círculos decorativos difuminados en las esquinas
- Card principal blanca con sombra y borde sutil
- Layout de dos columnas: CTA a la izquierda, información a la derecha
- Título con buen contraste (`text-gray-900`)

---

## 3. 📊 Mejora de la Sección "Vamos a Impactar" (StatsSection)

### Problemas Identificados
- Los números tenían colores diferentes (verde degradado en 3, negro en el último)
- Fondo muy plano, sin profundidad visual
- No guardaba orden lógico visual

### Solución Implementada
- **Unificación de colores:** Todos los números ahora usan `text-secondary-[bosques-nublados]` (verde oscuro)
- **Fondo mejorado:** 
  - Fondo verde con textura (`bg-1.svg`)
  - Overlay con gradiente verde para profundidad
  - Título en color crema con acento amarillo-tierra
- **Grid de cards:** Fondo semi-transparente con borde sutil

**Archivo modificado:**
- `src/components/StatsSection.tsx`

**Cambios específicos:**
- Removido el prop `accentColor` de `StatCard`
- Todos los números ahora tienen el mismo color verde oscuro
- Sección con fondo verde coherente con el manual de marca

---

## 4. 🔗 Mejora de Enlaces en "Blog Reciente"

### Problema Identificado
- Los tres enlaces "Leer más >" llevaban todos a `/noticias` sin diferenciación
- No había forma de acceder directamente al contenido específico de cada tema
- Experiencia de usuario incompleta

### Solución Implementada
- Cada card del blog ahora enlaza a una noticia específica usando anclas
- Se añadió el campo `targetNoticiaId` a cada post del blog
- Enlaces ahora apuntan a `/noticias#noticia-{id}`

**Archivos modificados:**
- `src/components/BlogSection.tsx`
- `src/pages/Noticias.tsx`

**Mapeo de enlaces:**
- "Descarbonización y Sostenibilidad" → `/noticias#noticia-3`
- "Tokenización de Activos Ambientales" → `/noticias#noticia-2`
- "Reforestación con Biotecnología" → `/noticias#noticia-1`

**Implementación técnica:**
- Se añadieron IDs únicos (`id="noticia-{id}"`) a cada noticia en la página
- Los enlaces usan hash navigation para scroll automático

---

## 5. 🎓 Creación del Componente Reutilizable "TrainingSection"

### Objetivo
- Extraer la sección de formación continua para reutilizarla en múltiples páginas
- Mantener consistencia visual entre Home y Ruta de Formación

### Implementación
- Se creó el componente `TrainingSection.tsx`
- Se reemplazó la sección inline en `Home.tsx` por el nuevo componente
- Se añadió el mismo componente en `RutaFormacion.tsx` según indicaciones del GACT

**Archivos creados/modificados:**
- `src/components/TrainingSection.tsx` (nuevo)
- `src/pages/Home.tsx` (modificado)
- `src/pages/RutaFormacion.tsx` (modificado)

**Características del componente:**
- Badge "Formación Continua"
- Título "Aprende con Nosotros"
- Badge "INSCRIPCIONES ABIERTAS" con animación
- Botón principal que enlaza al formulario de Google Forms
- Botón secundario que enlaza a `/ruta-de-formacion`
- Layout responsive con dos columnas en desktop

---

## 6. 📚 Actualización de la Página "Ruta de Formación"

### Contenido Añadido

#### Sección de Componentes de la Ruta
- Tres tarjetas informativas con imágenes:
  1. **Etapa de Sensibilización y Presentación del Proyecto Terrasacha**
  2. **Etapa de Formación Técnica**
  3. **Etapa de Aplicación en Territorio**

**Archivo modificado:**
- `src/pages/RutaFormacion.tsx`

**Estructura implementada:**
- Grid responsive (1 columna móvil, 3 columnas desktop)
- Cada card incluye:
  - Imagen (esperando archivos: `ruta-formacion-1.jpg`, `ruta-formacion-2.jpg`, `ruta-formacion-3.jpg`)
  - Título descriptivo
  - Texto explicativo
  - Estilos consistentes con el resto de la página

#### Integración de TrainingSection
- Se añadió la sección completa de formación continua al final de la página
- Incluye el enlace de inscripción y toda la información de cursos
- Cumple con el requerimiento del GACT de tener "todo lo de la página de inicio" en este menú

---

## 7. 🎨 Ajustes de Contraste y Legibilidad

### Título en TrainingSection
- **Problema:** El título no se veía correctamente
- **Solución:** Cambio de `text-secondary-[bosques-nublados]` a `text-gray-900` para mejor contraste sobre fondo claro

**Archivo modificado:**
- `src/components/TrainingSection.tsx`

---

## 📁 Archivos Modificados/Creados

### Componentes Nuevos
- `src/components/TrainingSection.tsx`

### Componentes Modificados
- `src/components/ContactButton.tsx`
- `src/components/BlogSection.tsx`
- `src/components/StatsSection.tsx`

### Páginas Modificadas
- `src/pages/Home.tsx`
- `src/pages/Noticias.tsx`
- `src/pages/RutaFormacion.tsx`

---

## 🎯 Mejoras de UX Implementadas

1. **Navegación mejorada:** Enlaces específicos desde blog a noticias individuales
2. **Consistencia visual:** Componentes reutilizables mantienen el mismo diseño
3. **Accesibilidad:** Botón de contacto funciona en todos los dispositivos
4. **Legibilidad:** Mejores contrastes de color en todas las secciones
5. **Coherencia de marca:** Colores unificados según manual de marca

---

## 📝 Notas Técnicas

### Imágenes Pendientes
Las siguientes imágenes deben ser añadidas a `public/assets/images/`:
- `ruta-formacion-1.jpg`
- `ruta-formacion-2.jpg`
- `ruta-formacion-3.jpg`

Estas imágenes deben descargarse de la carpeta compartida de Google Drive: "ruta de formación"

### Colores de la Paleta Utilizados
- `secondary-[bosques-nublados]`: Verde oscuro principal
- `secondary-[amarillo-tierra]`: Amarillo tierra para acentos
- `secondary-pradera`: Verde pradera
- `secondary-claro`: Verde claro
- `primary`: Color primario del proyecto
- `#f6f0d0`: Color crema para textos sobre fondos oscuros

---

## ✅ Checklist de Funcionalidades

- [x] Botón flotante de contacto funcional en desktop y móvil
- [x] Sección de formación continua con diseño mejorado
- [x] Números de estadísticas con color unificado
- [x] Enlaces del blog apuntando a noticias específicas
- [x] Componente TrainingSection reutilizable
- [x] Página Ruta de Formación con 3 tarjetas informativas
- [x] Integración de sección de formación en Ruta de Formación
- [x] Contraste y legibilidad mejorados en todos los textos

---

## 🔄 Próximos Pasos Sugeridos

1. **Noticias:**
   - Implementar vista de detalle individual para cada noticia (`/noticias/:id`)
   - Añadir campo de fuente a las noticias externas
   - Separar noticias del proyecto vs noticias de actualidad

2. **Imágenes:**
   - Descargar y añadir las 3 imágenes de la ruta de formación
   - Verificar que todas las imágenes estén optimizadas

3. **Contenido:**
   - Revisar y actualizar textos según feedback del director de Investigación
   - Cargar información completa del proyecto según indicaciones

---

**Documento generado automáticamente**  
*Última actualización: Enero 2025*


