# Arquitectura, Testing, Principios de Diseño y Buenas Prácticas

## 📐 Arquitectura de Software

### ¿Qué es la Arquitectura de Software?

La arquitectura de software es el conjunto de decisiones estructurales que definen la organización de un sistema, sus componentes y la interacción entre ellos. Incluso los programas simples tienen algún tipo de arquitectura, aunque sea implícita.

**Por qué es importante:**
- Facilita el mantenimiento y escalabilidad
- Reduce el acoplamiento entre partes
- Mejora la calidad, el rendimiento y la seguridad
- Facilita la comunicación entre equipos
- Prepara para adaptarse a necesidades futuras

**Decisiones arquitectónicas típicas:**
- Separación por capas (presentación, negocio, datos)
- Uso de patrones (MVC, hexagonal, microservicios, etc.)
- Cómo fluyen los datos entre módulos
- Qué tecnologías y frameworks usar

### Diseño vs Arquitectura

- **Diseño de software**: Decisiones a nivel bajo/de detalle: cómo se organizan clases, funciones, interfaces y sus relaciones.
- **Arquitectura de software**: Decisiones a nivel alto/global: cómo se divide el sistema en módulos o capas y cómo se comunican entre sí.

La arquitectura define el "esqueleto" del sistema, y el diseño define los "músculos y órganos" que lo hacen funcionar. Ambos deben trabajar juntos para lograr un sistema escalable, mantenible y entendible.

### Arquitectura por Capas (Layered Architecture)

El proyecto implementa una **arquitectura por capas** basada en el framework NestJS, siguiendo el patrón de diseño modular que separa las responsabilidades en capas bien definidas:

#### 1. **Capa de Presentación (Controllers)**
- **Responsabilidad**: Manejar las solicitudes HTTP entrantes, validar datos de entrada y devolver respuestas.
- **Ejemplo**: `OrderController`, `AuthController`, `ProductController`
- **Características**:
  - Decoradores de rutas (`@Get()`, `@Post()`, `@Patch()`, `@Delete()`)
  - Uso de Guards para autenticación y autorización (`@UseGuards(JwtAuthGuard, RolesGuard)`)
  - Validación de roles mediante decoradores personalizados (`@Roles('admin', 'vendor')`)
  - Manejo de parámetros con decoradores (`@Param()`, `@Body()`)

#### 2. **Capa de Lógica de Negocio (Services)**
- **Responsabilidad**: Contener la lógica de negocio, reglas de aplicación y orquestación de operaciones.
- **Ejemplo**: `OrderService`, `AuthService`, `ProductService`
- **Características**:
  - Inyección de dependencias mediante `@Injectable()`
  - Acceso a repositorios de datos mediante TypeORM
  - Validación de reglas de negocio
  - Manejo de excepciones personalizadas (`NotFoundException`, `BadRequestException`)

#### 3. **Capa de Acceso a Datos (Repositories/Entities)**
- **Responsabilidad**: Abstraer el acceso a la base de datos y definir el modelo de datos.
- **Ejemplo**: Entidades como `Order`, `User`, `Vendor`, `Product`
- **Características**:
  - TypeORM como ORM (Object-Relational Mapping)
  - Definición de relaciones (OneToMany, ManyToOne, OneToOne)
  - Migraciones de base de datos para versionado del esquema
  - Decoradores de TypeORM para mapeo (`@Entity()`, `@Column()`, `@PrimaryGeneratedColumn()`)

#### 4. **Capa de Transferencia de Datos (DTOs)**
- **Responsabilidad**: Definir la estructura de datos para la comunicación entre capas.
- **Ejemplo**: `CreateOrderDto`, `CreateAuthDto`, `UpdateOrderDto`
- **Características**:
  - Validación mediante `class-validator` (`@IsEmail()`, `@IsString()`, `@MinLength()`)
  - Transformación de datos con `class-transformer`
  - Separación entre DTOs de creación, actualización y consulta

### Arquitectura Modular

El proyecto sigue el patrón de **módulos** de NestJS, donde cada funcionalidad está encapsulada en su propio módulo:

```
src/
├── auth/          # Autenticación y autorización
├── user/          # Gestión de usuarios
├── vendor/        # Gestión de vendedores
├── product/       # Gestión de productos
├── order/         # Gestión de pedidos
├── order-detail/  # Detalles de pedidos
├── driver/        # Gestión de conductores
├── vehicle/       # Gestión de vehículos
├── payment/       # Gestión de pagos
└── vendor-schedule/ # Horarios de vendedores
```

Cada módulo contiene:
- **Module**: Configuración del módulo y dependencias
- **Controller**: Endpoints HTTP
- **Service**: Lógica de negocio
- **Entities**: Modelos de datos
- **DTOs**: Objetos de transferencia de datos
- **Spec files**: Tests unitarios

### Inversión de Dependencias (Dependency Injection)

El proyecto utiliza el patrón de **Inversión de Dependencias (DI)** de NestJS:
- Los servicios se inyectan en controladores mediante el constructor
- Los repositorios se inyectan en servicios mediante `@InjectRepository()`
- Configuración global mediante `ConfigModule` y `ConfigService`
- Facilita el testing mediante mocks y stubs

### Autenticación y Autorización

- **JWT (JSON Web Tokens)**: Implementación de autenticación basada en tokens
- **Passport Strategy**: Uso de `passport-jwt` para validación de tokens
- **Guards**: `JwtAuthGuard` para proteger rutas
- **Role-Based Access Control (RBAC)**: Sistema de roles (`cliente`, `vendor`, `driver`, `admin`)
- **Guards de Roles**: `RolesGuard` para validar permisos basados en roles

### Arquitectura Monolítica

Este proyecto sigue un enfoque **monolítico modular**, donde todas las funcionalidades están en un único bloque de código que se desarrolla, prueba y despliega como una unidad.

**Características:**
- Desarrollo y despliegue unificados
- Comunicaciones internas simples (llamadas directas de función/método)
- Organización modular interna (cada feature en su propio módulo NestJS)

**Ventajas:**
- Ideal para proyectos pequeños o MVPs por su simplicidad
- Latencia interna baja, porque los componentes están todos juntos
- Desarrollo más rápido al principio
- Fácil de entender y desarrollar
- Costos de configuración bajos

**Desventajas:**
- Difícil de escalar solo una parte: hay que escalar todo
- Si se modifica un módulo, puede afectar muchas otras áreas
- Con el crecimiento, puede convertirse en una "monstruosidad" difícil de mantener

**Variantes dentro del Monolito:**

#### MVC (Modelo-Vista-Controlador)
- **Modelo**: Datos / lógica de negocio (Entities, Services)
- **Vista**: Presentación / interfaz con el usuario (no aplica en API REST)
- **Controlador**: Gestiona entrada del usuario, coordina Modelo y Vista (Controllers)
- **Ventaja**: Separación de responsabilidades básica

#### Modular Architecture dentro del Monolito
Aunque sea un monolito, el código está dividido en módulos internos (por ejemplo, un módulo "órdenes", un módulo "clientes", etc.) que internamente están bien organizados. Esta variante mejora la mantenibilidad.

#### Clean Architecture (dentro de Monolito)
Propone separar claramente:
- **Capa de entidades (dominio)**: Entities
- **Casos de uso / lógica de negocio**: Services
- **Interfaces/adaptadores**: Controllers, DTOs
- **Infraestructura (BD, frameworks, etc)**: TypeORM, ConfigModule

**Ventaja**: Mayor capacidad de mantenimiento, testabilidad e independencia de frameworks/tecnología

### Arquitectura Hexagonal (Ports and Adapters)

La arquitectura hexagonal es un patrón de diseño que tiene como objetivo principal separar la lógica de negocio del núcleo de una aplicación de la infraestructura y las tecnologías externas. Esto se logra mediante el uso de puertos y adaptadores.

**Conceptos clave:**
- **Puertos**: Son interfaces que definen el contrato o las interacciones que el núcleo de la aplicación tiene con el exterior. Por ejemplo, una interfaz para interactuar con una base de datos.
- **Adaptadores**: Son las implementaciones concretas de esos puertos, que se encargan de la comunicación con tecnologías específicas. Por ejemplo, un adaptador para MySQL o un adaptador para una API REST.

**En este proyecto:**
- Los Services actúan como el núcleo de la aplicación (lógica de negocio)
- Los Repositories de TypeORM actúan como adaptadores de acceso a datos
- Los Controllers actúan como adaptadores de entrada (HTTP)
- Los DTOs definen los contratos de comunicación

**Ventajas:**
- Facilita la evolución de la aplicación
- Simplifica las pruebas (se pueden usar adaptadores "falsos" para probar la lógica de negocio)
- Promueve el desacoplamiento entre las capas
- Permite cambiar la base de datos o el framework sin afectar la lógica de negocio

### Monolito vs. Microservicios

**Una decisión estratégica, no solo técnica**

La elección de arquitectura (monolito, microservicios, serverless, etc.) no depende solo de la tecnología, sino de la estrategia de negocio, la estructura del equipo y las necesidades de evolución del sistema.

| Aspecto | Monolito | Microservicios |
|---------|----------|----------------|
| **Escalabilidad** | Ineficiente (todo o nada). Pobre para equipos grandes. | Quirúrgica. Excelente para equipos autónomos. |
| **Despliegue** | Simple pero lento, arriesgado y poco frecuente. | Complejo pero rápido, independiente y frecuente con automatización. |
| **Velocidad de desarrollo** | Más rápida al principio, disminuye exponencialmente con la complejidad. | Más lenta inicialmente, mantiene el ritmo a medida que el sistema escala. |
| **Simplicidad y Costo Inicial** | Fácil de entender y desarrollar, costos de configuración bajos. | Más compleja y costosa (requiere orquestación). |
| **Riesgo y Frecuencia de Despliegue** | Menos frecuentes, más arriesgados (un error puede afectar todo). | Los servicios son independientes (un fallo no derriba todo). |
| **Mantenimiento y Evolución** | Se vuelve complejo, evolución difícil por alto acoplamiento. | Más fácil, evolución más ágil (actualizaciones independientes). |
| **Autonomía y Resiliencia** | Baja autonomía, un fallo puede derribar todo el sistema. | Alta autonomía de equipos, alta resiliencia. |

**Ley de Conway:**
"Las organizaciones diseñan sistemas que reflejan su estructura de comunicación."
- Si tu equipo es pequeño y trabaja todo junto, tenderás naturalmente a crear un monolito
- Si tenés equipos grandes o especializados, es probable que termines con módulos o microservicios

**Maniobra Inversa de Conway:**
Diseñá la estructura de tus equipos según la arquitectura que querés obtener.
- Equipos pequeños y autónomos → fomentan servicios independientes
- Esto convierte los microservicios en un patrón organizacional de escalado, no solo técnico

**Prerrequisitos para Microservicios:**
Adoptar microservicios no es "romper el monolito en partes". Requiere:
1. Aprovisionamiento rápido: poder crear, desplegar y eliminar entornos con facilidad (infraestructura como código)
2. Monitorización robusta: cada servicio debe poder ser observado individualmente (logs, métricas, trazas)
3. Despliegue automatizado (CI/CD): sin pipelines automatizados, el mantenimiento se vuelve caótico
4. Cultura DevOps: colaboración estrecha entre desarrollo, operaciones y QA
5. Capacidad de rollback y resiliencia: si un servicio falla, el sistema debe seguir funcionando

### Comunicación entre Microservicios

En un entorno distribuido, los servicios necesitan comunicarse. Existen dos enfoques principales:

#### Comunicación Síncrona
- **Requiere una respuesta inmediata**
- Se usa para operaciones críticas o transaccionales
- **REST**: Estándar legible y fácil de integrar
- **gRPC**: Protocolo binario, rápido, ideal para comunicación interna entre servicios

#### Comunicación Asíncrona
- **No requiere esperar respuesta**
- Favorece la resiliencia y el desacoplamiento temporal
- **Colas de mensajes** (RabbitMQ, Kafka): Almacenan mensajes hasta que el receptor esté disponible
- **Eventos** (Event Bus): Permiten que múltiples servicios reaccionen a cambios sin conocerse entre sí

**Cuanto más asíncrona es la comunicación, mayor es la independencia entre servicios (y también la complejidad).**

### Patrones del Ecosistema de Microservicios

#### API Gateway
- Es la puerta de entrada única del sistema
- Encargado de enrutar peticiones, autenticar usuarios y agregar respuestas de varios servicios
- Simplifica la interacción del cliente y centraliza la seguridad

#### Service Discovery
- En entornos dinámicos (como Kubernetes), las IP de los servicios cambian constantemente
- El Service Registry actúa como un "directorio telefónico":
  - Los servicios se registran automáticamente al iniciar
  - Otros servicios consultan ese registro para encontrarlos

#### Patrón Saga (Consistencia Distribuida)
- En un sistema distribuido, una transacción global (como un pago) se divide en transacciones locales coordinadas
- Si una de ellas falla, se ejecuta una transacción compensatoria que revierte los cambios anteriores
- Así se logra consistencia eventual sin depender de bases de datos centralizadas

#### Diseño para Fallos (Resiliencia)
En arquitecturas distribuidas, el fallo es la norma, no la excepción. Diseñar para el fallo significa anticipar errores y limitar su impacto.

**Patrones comunes:**
- **Retry**: Reintenta operaciones fallidas con un retraso o backoff
- **Circuit Breaker**: Corta temporalmente las llamadas a un servicio inestable, evitando cascadas de fallos
- **Bulkhead**: Divide recursos (por ejemplo, hilos o conexiones) para que un módulo no consuma todo el sistema

**El objetivo no es evitar los fallos, sino aislarlos y recuperarse rápidamente.**

### Diseño Orientado a Base de Datos vs Diseño Orientado al Dominio

Hay dos grandes filosofías para modelar sistemas:

#### 1. Diseño Orientado a Base de Datos (Data-Driven Design)
- El diseño comienza por el modelo de datos
- La base de datos es el centro del sistema: primero se diseñan las tablas, después el código que las manipula (CRUD)
- Todo el sistema termina acoplado a la estructura de la base de datos
- **Problema**: El dominio del negocio queda subordinado al almacenamiento; es difícil cambiar la lógica sin afectar la BD

En este modelo, el software se convierte en una "interfaz bonita" para la base de datos, pero no necesariamente refleja cómo funciona el negocio.

#### 2. Diseño Orientado al Dominio (Domain-Driven Design, DDD)
- **La regla de oro**: "El código debe modelar el negocio, no la base de datos."
- El punto de partida es el dominio (la lógica del negocio, sus reglas, su lenguaje)
- La base de datos pasa a ser un detalle de implementación
- Se dividen las responsabilidades en Contextos Delimitados (Bounded Contexts), cada uno con sus propias reglas, entidades y servicios
  - Cada contexto puede evolucionar de manera independiente
  - En una arquitectura moderna, cada contexto puede convertirse en un microservicio

**DDD no es un framework ni una librería: es una filosofía de diseño que busca reflejar la realidad del negocio dentro del código.**

**Conceptos clave:**
- **Contextos Delimitados (Bounded Contexts)**: Cada contexto tiene sus propias reglas, entidades y servicios. Cada contexto puede evolucionar de manera independiente.
- **Entidades de Dominio**: Representan conceptos del negocio (Order, User, Product, Vendor)
- **Servicios de Dominio**: Contienen lógica de negocio que no pertenece a una entidad específica
- **Repositorios**: Abstraen el acceso a datos, permitiendo que el dominio no dependa de la infraestructura

**En este proyecto:**
- Cada módulo (order, product, vendor) representa un contexto delimitado
- Las Entities modelan conceptos del negocio, no solo tablas de base de datos
- Los Services contienen la lógica de negocio específica del dominio
- Los Repositories ocultan los detalles de persistencia
- El código refleja el dominio del negocio (pedidos, productos, vendedores, conductores)

**Ventajas del enfoque DDD:**
- Menor acoplamiento entre módulos
- Alta coherencia interna en cada contexto
- Facilita identificar límites naturales si después se migra a microservicios
- Fomenta el trabajo colaborativo entre desarrolladores y expertos del negocio

**Relación entre Monolito, Microservicios y DDD:**
- Un monolito bien diseñado con DDD puede ser más mantenible que una red de microservicios mal implementados
- DDD ayuda a que el monolito crezca de forma modular, permitiendo luego una transición natural a microservicios
- Por eso se recomienda la estrategia "Monolito primero y bien":
  - Descubrís los límites del dominio de manera orgánica
  - Reducís la complejidad inicial
  - Si luego escalás, ya sabés cómo dividir

**Monolito Primero (y Bien):**
El enfoque "Monolith First" no es una defensa del pasado, sino una estrategia de mitigación de riesgos. Comenzar con un monolito permite:
- Entender mejor el negocio
- Descubrir los límites del dominio de forma orgánica
- Construir una base sólida antes de complicar la arquitectura
- Refactorizar un monolito bien estructurado es menos costoso que mantener un ecosistema distribuido mal diseñado

### Otras Arquitecturas Modernas

#### SOA (Service-Oriented Architecture)
- Antecesor de los microservicios
- Se basa en servicios reutilizables que se comunican por protocolos estandarizados (SOAP, XML, etc.)
- Los servicios son más grandes y menos granulares que los microservicios
- Enfocado a la integración empresarial (ERP, CRM, etc.), más que a la agilidad del desarrollo

#### EDA (Event-Driven Architecture)
- Basada en eventos que disparan acciones en los sistemas suscriptores
- Promueve un alto desacoplamiento y excelente escalabilidad
- Ideal para sistemas en tiempo real, IoT o de alto volumen
- **Ventajas**: Mayor resiliencia (si un servicio falla, los eventos quedan en cola), respuesta más rápida a cambios

#### Serverless Architecture
- El proveedor de la nube gestiona toda la infraestructura
- Los desarrolladores se enfocan solo en escribir funciones (FaaS — Functions as a Service)
- **Ventajas**: Escalado automático, pago por uso real, sin gestión de servidores
- **Desventajas**: Dependencia del proveedor (vendor lock-in), limitaciones técnicas, dificulta arquitecturas muy personalizadas

### Principios Cloud

Los principios cloud son un conjunto de buenas prácticas para diseñar, implementar y operar sistemas pensados para la nube. No es solo "subir el servidor a Internet", sino diseñar aplicaciones que aprovechen lo que la nube ofrece.

**Principales principios:**
1. **Escalabilidad**: Si un e-commerce tiene más tráfico en el Black Friday, se crean más instancias automáticamente (auto-scaling)
2. **Elasticidad**: Se ajusta dinámicamente, no solo hacia arriba sino también hacia abajo. Así se evita pagar por recursos ociosos
3. **Alta disponibilidad**: Se logra replicando servicios en distintas regiones o zonas de disponibilidad
4. **Tolerancia a fallos**: Usar circuit breakers, reintentos y backups automáticos
5. **Automatización**: Desde el aprovisionamiento de servidores hasta los despliegues (Infrastructure as Code, CI/CD)
6. **Seguridad como prioridad**: Políticas de autenticación, cifrado y control de identidades (IAM)
7. **Observabilidad**: Toda aplicación cloud debe ser medible: logs, métricas y trazas para detectar problemas y optimizar el rendimiento
8. **Optimización de costos**: La nube se paga por uso, así que parte del diseño es evitar desperdicios

### Pilares del Diseño Distribuido (Azure Well-Architected)

Todo sistema distribuido moderno debe balancear cinco pilares:

1. **Fiabilidad**: El sistema debe recuperarse ante fallos
2. **Seguridad**: Control de acceso, cifrado y auditoría
3. **Optimización de costos**: Pagar solo por los recursos realmente usados
4. **Excelencia operativa**: Monitoreo, automatización y documentación
5. **Eficiencia de rendimiento**: Máxima capacidad con el menor consumo

---

## 🧪 Testing en el Desarrollo de Software

El testing consiste en escribir código que prueba otro código. Su objetivo no es solo verificar que el programa funcione, sino garantizar que lo haga como se espera incluso después de cambios, refactorizaciones o nuevas implementaciones.

**El testing permite:**
- Detectar errores temprano antes de llegar a producción
- Validar requisitos y comportamientos esperados
- Mejorar la mantenibilidad y la confianza en el sistema

### Pirámide de Testing (Pyramid of Testing)

La pirámide de testing describe cómo equilibrar los diferentes tipos de pruebas para tener una base sólida, eficiente y rápida. Desde la base hasta la cima:

1. **Unit Tests (Pruebas Unitarias)** → Rápidas, numerosas y automáticas
2. **Integration Tests (Pruebas de Integración)** → Validan la interacción entre módulos
3. **E2E Tests (Pruebas de Extremo a Extremo)** → Evalúan el sistema completo desde la perspectiva del usuario

### Estrategia de Testing

El proyecto implementa una **estrategia de testing en múltiples niveles** siguiendo la pirámide de testing:

#### 1. **Tests Unitarios (Unit Testing)**

Los tests unitarios se enfocan en la parte más pequeña y aislada del sistema: una función, método o clase. Su misión es comprobar que, dadas ciertas entradas, la unidad produce exactamente la salida esperada.

**Cómo se hace:**
- Se prueba cada unidad de forma independiente
- Se reemplazan dependencias externas con mocks o stubs
- Se evalúan distintos casos de entrada/salida

**Finalidad:**
- Detectar errores localmente y de forma rápida
- Aumentar la seguridad en refactorizaciones
- Garantizar una base confiable antes de integrar módulos más complejos

**En este proyecto:**
- **Ubicación**: Archivos `*.spec.ts` junto a los archivos de código
- **Framework**: Jest
- **Características**:
  - Mocks de repositorios mediante `createMockRepository()`
  - Mocks de servicios externos (bcrypt, JWT)
  - Tests de casos exitosos y casos de error
  - Cobertura de código mediante `test:cov`

**Ejemplo de estructura de test unitario**:
```typescript
describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: MockRepository<Order>;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: createMockRepository() },
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
  });
  
  it('debería crear una orden', async () => {
    // Arrange
    const dto = { /* ... */ };
    orderRepo.save.mockResolvedValue(mockOrder);
    
    // Act
    const result = await service.create(dto);
    
    // Assert
    expect(result).toBeDefined();
    expect(orderRepo.save).toHaveBeenCalled();
  });
});
```

#### 2. **Tests de Integración (Integration Testing)**

Los tests de integración se centran en verificar que distintas unidades ya probadas funcionen correctamente al interactuar entre sí.

**Cómo se hace:**
- Se combinan varios módulos del sistema
- Se prueba la comunicación entre ellos: acceso a base de datos, APIs, controladores, etc.

**Finalidad:**
- Detectar errores en la conexión entre componentes
- Asegurar que los módulos integrados mantengan sus contratos y que los datos fluyan correctamente

**En este proyecto:**
- **Ubicación**: Archivos `*.integration.spec.ts`
- **Características**:
  - Base de datos en memoria (SQLite) para tests
  - Configuración de TypeORM para testing
  - Tests de flujos completos de negocio
  - Limpieza de datos después de cada test

**Ejemplo de test de integración**:
```typescript
describe('ProductService (Integration)', () => {
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: ENTITIES,
          synchronize: true,
        }),
      ],
    }).compile();
  });
  
  it('debería crear un producto asociado a un vendor real', async () => {
    const vendor = await vendorService.create(vendorDto);
    const product = await productService.create(productDto);
    expect(product.vendor.id).toBe(vendor.id);
  });
});
```

#### 3. **Tests End-to-End (E2E Testing)**

Los tests end-to-end validan el flujo completo de la aplicación, desde el punto de vista del usuario final. Simulan interacciones reales, comprobando que todos los componentes (frontend, backend, base de datos) trabajen correctamente.

**Cómo se hace:**
- Se escriben escenarios que reflejen tareas reales del usuario (por ejemplo, iniciar sesión, comprar un producto, recibir confirmación)
- A menudo usan herramientas como Cypress, Playwright o Selenium

**Finalidad:**
- Validar que el sistema completo funcione como una unidad coherente
- Asegurar que la experiencia del usuario cumpla los requisitos funcionales

**En este proyecto:**
- **Ubicación**: Carpeta `test/`
- **Framework**: Supertest + Jest
- **Características**:
  - Tests de endpoints HTTP completos
  - Configuración de aplicación NestJS para testing
  - Validación de respuestas HTTP

#### 4. **Utilidades de Testing**
- **Mock Repository**: Función `createMockRepository()` para crear mocks consistentes
- **Test Mocks**: Archivo `test/utils/test-mocks.ts` con utilidades reutilizables
- **Configuración de Jest**: Configuración personalizada en `package.json`

### TDD (Test-Driven Development)

El Desarrollo Guiado por Pruebas (TDD) es una metodología en la que primero se escriben los tests y luego el código que los hace pasar.

**El proceso sigue un ciclo corto y continuo:**

1. **Red**: Escribir un test que falla (porque la funcionalidad aún no existe)
2. **Green**: Implementar el código mínimo necesario para que el test pase
3. **Refactor**: Mejorar el código, manteniendo los tests en verde

**Finalidad:**
- Crear software con objetivos claros y verificables
- Prevenir errores futuros: cualquier cambio que rompa una funcionalidad será detectado inmediatamente
- Fomentar un diseño más modular y desacoplado

**TDD es "enemigo de Scrum y Cascada"** porque no sigue fases rígidas de planificación o testeo al final: el testeo es continuo e integrado en el desarrollo.

### Mocking y Stubbing

Ambas técnicas se utilizan para aislar la unidad que se quiere probar, reemplazando sus dependencias reales por versiones simuladas.

**Cómo se aplican:**

**Mocking:**
- Crea objetos falsos que simulan comportamientos
- Permiten verificar interacciones, como cuántas veces se llamó un método o con qué parámetros
- Ejemplo: mock de una API que verifica que se haya llamado con el token correcto

**Stubbing:**
- Proporciona respuestas predefinidas ante ciertas llamadas
- No verifica interacciones, solo devuelve valores
- Ejemplo: stub que devuelve un JSON fijo para evitar depender de una base de datos real

**Finalidad:**
- Aislar las pruebas unitarias
- Evitar dependencias externas costosas o no deterministas
- Mejorar la velocidad y la confiabilidad de los tests

**En este proyecto:**
- Se utilizan mocks de repositorios para aislar los servicios
- Se utilizan stubs para servicios externos como bcrypt y JWT
- Las utilidades de testing facilitan la creación de mocks consistentes

### Coverage (Cobertura de Código)

El coverage mide qué porcentaje del código es ejecutado durante los tests. No garantiza que el código esté libre de errores, pero sí indica qué partes fueron realmente probadas.

**Cómo se mide:**
- Se utilizan herramientas de análisis como:
  - Istanbul / NYC (JavaScript/TypeScript)
  - JaCoCo (Java/Kotlin)
  - Coverage.py (Python)
- Generan reportes visuales que muestran qué líneas o ramas fueron ejecutadas y cuáles no

**Finalidad:**
- Detectar zonas sin cobertura
- Aumentar la confianza y calidad del software
- Fomentar una cultura de testing continua

**En este proyecto:**
- **Comando**: `npm run test:cov`
- **Configuración**: Definida en `package.json` con `collectCoverageFrom`
- **Objetivo**: Un buen objetivo suele ser entre 70% y 90% de cobertura, priorizando las partes críticas del sistema

### Análisis Funcional (Tests Dinámicos)

Los tests dinámicos verifican el comportamiento ejecutando el código.

**Tipos de análisis funcional:**
- **Pyramid Testing**: Estrategia para organizar tests:
  - Muchos unit tests (base de la pirámide)
  - Menos integration tests
  - Pocos end-to-end tests
- **Load Testing**: Medir rendimiento bajo alta carga de usuarios
- **DAST (Dynamic Application Security Testing)**: Pruebas de seguridad en ejecución
  - Herramientas: OWASP ZAP, Burp Suite, Acunetix

---

## 🎨 Principios de Diseño

### Acoplamiento (Coupling) y Cohesión

**Acoplamiento (Coupling)**: Es el grado de dependencia entre módulos. Cuanto más acoplados, más difícil mantener el sistema (cambiar uno rompe otros).

**Cómo reducir el acoplamiento:**
- Tener menos dependencias directas
- Usar inyección de dependencias
- Depender de abstracciones (interfaces), no de implementaciones concretas
- Usar adaptadores para aislar cambios

**En este proyecto:**
- Los servicios dependen de interfaces (repositorios de TypeORM) no de implementaciones concretas
- La inyección de dependencias reduce el acoplamiento
- Los módulos están bien separados, reduciendo dependencias entre ellos

### SOLID vs STUPID

| SOLID (buenas prácticas) | STUPID (malas prácticas) |
|--------------------------|--------------------------|
| **S**ingle Responsibility | **S**ingleton (abuso del patrón) |
| **O**pen/Closed | **T**ight Coupling (acoplamiento fuerte) |
| **L**iskov Substitution | **U**ntestability (difícil de probar) |
| **I**nterface Segregation | **P**remature Optimization |
| **D**ependency Inversion | **I**ndescriptive Naming (nombres confusos) |
| – | **D**uplication (código duplicado) |

### 1. **Principios SOLID**

Su objetivo principal es manejar el acoplamiento, mejorar la mantenibilidad del código y hacerlo más tolerante al cambio. Son principios, no reglas.

#### Single Responsibility Principle (SRP)

**"Una clase debería tener una sola razón para cambiar"**

Esto significa que cada clase o módulo debe encargarse de una única responsabilidad o propósito dentro del sistema.

**Cómo aplicarlo:**
- Crear clases pequeñas y específicas, con objetivos bien definidos
- Evitar clases "Dios" que hacen de todo. Componer el comportamiento usando otras clases (inyectar colaboradores)

**Finalidad:**
- Mayor cohesión (cada clase hace algo lógico y bien definido)
- Menor acoplamiento (los cambios afectan menos partes del sistema)
- Facilita la refactorización y el testing

**En este proyecto:**
- **Controllers**: Solo manejan HTTP
- **Services**: Solo contienen lógica de negocio
- **Entities**: Solo definen estructura de datos
- **DTOs**: Solo transfieren datos

**Por qué importa**: Tener más de una responsabilidad implica que los cambios en una parte pueden romper otra, incluso sin relación directa. Separar responsabilidades reduce riesgos y aumenta la tolerancia a cambios.

#### Open/Closed Principle (OCP)

**"El software debería estar abierto a extensión, pero cerrado a modificación"**

Esto significa que debemos poder agregar nuevas funcionalidades sin modificar el código existente.

**Cómo aplicarlo:**
- Usar interfaces o clases abstractas en lugar de implementaciones concretas
- Diseñar para la extensión mediante polimorfismo, no mediante if o switch dentro del mismo código

**Finalidad:**
- Facilitar la incorporación de nuevos casos de uso
- Reducir el riesgo de introducir errores en código que ya funciona

**En este proyecto:**
- Uso de módulos permite agregar nuevas funcionalidades sin modificar código existente
- Decoradores permiten extender funcionalidad sin modificar clases base
- Los servicios pueden extenderse mediante herencia o composición

**Beneficio**: Limita los efectos secundarios. El nuevo comportamiento se agrega sin alterar lo que ya funciona.

#### Liskov Substitution Principle (LSP)

**"Si S es un subtipo de T, entonces una instancia de T debe poder ser reemplazada por una de S sin alterar el comportamiento correcto del programa"**

En otras palabras, las subclases deben respetar el contrato de la superclase.

**Cómo aplicarlo:**
- Asegurarse de que las subclases no cambien las reglas definidas por la clase base
- Las subclases deben poder usarse sin que el cliente note la diferencia

**Finalidad:**
- Mantener la correctitud y coherencia del sistema
- Permitir la extensión de código (OCP) sin romper el comportamiento

**En este proyecto:**
- Las implementaciones pueden ser sustituidas por sus interfaces
- Repositorios de TypeORM pueden ser sustituidos por mocks en testing
- Los servicios pueden ser reemplazados por implementaciones alternativas sin afectar a los controladores

#### Interface Segregation Principle (ISP)

**"Ningún cliente debería verse forzado a depender de métodos que no usa"**

Este principio propone crear interfaces específicas para cada caso, en lugar de interfaces grandes y genéricas.

**Cómo aplicarlo:**
- Dividir interfaces grandes en interfaces más pequeñas y enfocadas ("role interfaces")
- Diseñar las interfaces pensando en los clientes que las usan, no en las implementaciones

**Finalidad:**
- Lograr alta cohesión y bajo acoplamiento
- Evitar que un cambio en una interfaz afecte a clases que no usan ese método

**En este proyecto:**
- DTOs específicos para cada operación (`CreateOrderDto`, `UpdateOrderDto`)
- No se fuerza a los clientes a depender de interfaces que no usan
- Cada módulo tiene sus propias interfaces y contratos

#### Dependency Inversion Principle (DIP)

**"Los módulos de alto nivel no deberían depender de los de bajo nivel. Ambos deben depender de abstracciones"**

Esto significa que las clases deben depender de interfaces o contratos, no de implementaciones concretas.

**Cómo aplicarlo:**
- Inyectar dependencias (por constructor o parámetros)
- Usar interfaces que definan el contrato de lo que se necesita
- Las implementaciones concretas (bajo nivel) deben "ajustarse" al contrato

**Finalidad:**
- Facilitar el reemplazo de componentes (por ejemplo, cambiar una base de datos o servicio)
- Hacer las clases más testeables (inyectando mocks o fakes)
- Mantener un flujo de dependencias estable y predecible

**En este proyecto:**
- Dependencias se inyectan en lugar de crearse internamente
- Los servicios dependen de abstracciones (repositorios) no de implementaciones concretas
- La inyección de dependencias de NestJS facilita este principio

### 2. **Principios Generales de Diseño**

Además de SOLID, hay otros principios importantes a seguir:

- **Nombres con sentido semántico**: Las variables, funciones y clases deben tener nombres que expresen claramente su propósito
- **Ser consistente en la forma de escribir**: Mantener un estilo de código consistente en todo el proyecto
- **Funciones simples y pequeñas**: Cada función debe hacer una sola cosa y hacerla bien
- **Evitar comentarios innecesarios**: El código debe ser autoexplicativo
- **Early Returns**: Usar returns tempranos para evitar anidaciones profundas
- **No usar números/strings mágicos**: Usar constantes con nombres descriptivos
- **Usar DTOs**: Objetos de transferencia de datos para comunicar entre capas
- **Tell Don't Ask**: Que los objetos hagan su trabajo, no exponer datos para que otros lo hagan
- **DRY (Don't Repeat Yourself)**: Evitar duplicación de código
- **KISS (Keep It Simple, Stupid)**: No complicar lo simple
- **Principios SOLID**: Aplicar los principios SOLID cuando sea apropiado

**En este proyecto:**
- Nombres descriptivos y semánticos
- Estilo de código consistente
- Funciones pequeñas y enfocadas
- Uso de constantes en lugar de valores mágicos
- DTOs para transferencia de datos
- Aplicación de principios SOLID

### 3. **DRY (Don't Repeat Yourself)**
- Reutilización de código mediante:
  - Módulos compartidos
  - Utilidades de testing reutilizables
  - Guards y decoradores personalizados
  - Configuración centralizada

### 4. **Separation of Concerns (SoC)**
- Separación clara de responsabilidades:
  - Autenticación en módulo `auth/`
  - Lógica de negocio en servicios
  - Acceso a datos en repositorios
  - Validación en DTOs

### 5. **Dependency Injection (DI)**
- Inyección de dependencias mediante el sistema de NestJS
- Facilita el testing y la mantenibilidad
- Reduce el acoplamiento entre componentes

### 6. **Repository Pattern**
- Abstracción del acceso a datos mediante TypeORM
- Los servicios no conocen detalles de implementación de la base de datos
- Facilita el cambio de base de datos o ORM

### 7. **DTO Pattern**
- Objetos de transferencia de datos para comunicación entre capas
- Validación de datos de entrada
- Separación entre modelos de dominio y modelos de transferencia

---

## 🎭 Patrones de Diseño

### ¿Qué son los Patrones de Diseño?

Los patrones de diseño son soluciones reutilizables y probadas para problemas comunes de diseño de software. Ayudan a escribir código más claro, modular, mantenible y extensible, y permiten comunicar ideas entre desarrolladores usando un lenguaje común.

**Categorías principales:**
- **Creacionales**: Cómo se crean los objetos
- **Estructurales**: Cómo se organizan y relacionan los objetos
- **De comportamiento (Behavioral)**: Cómo interactúan y colaboran los objetos entre sí

### Patrones Creacionales

#### Factory Pattern

**Qué hace**: Centraliza la lógica de creación de objetos dentro de una clase "fábrica" especializada.

**Ejemplo conceptual:**
- Una `CarFactory` crea instancias de `Car`
- Una `CustomerFactory` crea objetos `Customer` aplicando validaciones o configuración inicial

**Ventajas:**
- Código reutilizable (la creación está centralizada)
- Código testeable (se puede probar la fábrica sola)
- Fácil de cambiar (si la creación cambia, se modifica un único lugar)
- Cumple el principio de responsabilidad única (SRP)

**📌 Esto es útil cuando:**
- La creación de objetos es compleja
- El código necesita cambiar fácilmente el tipo de objeto que crea

### Patrones Estructurales

#### Repository Pattern

**Qué hace**: Actúa como intermediario entre el dominio y la base de datos. Un repositorio se encarga de persistir y recuperar objetos, ocultando los detalles del almacenamiento.

**Conceptos clave:**
- Cada tipo de entidad (Customer, Product, Order) tiene su propio repositorio (CustomerRepository, etc.)
- Expone una interfaz bien definida con operaciones como `findById`, `findAll`, `save`, `delete`
- Da la ilusión de una colección en memoria de objetos de dominio
- Aísla el dominio de los detalles de acceso a datos → menor acoplamiento

**Ventajas:**
- Facilita el testing (se pueden usar repositorios en memoria falsos)
- Reduce código repetido de consultas
- Promueve una arquitectura en capas y orientada a objetos

**En este proyecto:**
- TypeORM implementa el Repository Pattern
- Los repositorios abstraen el acceso a datos
- Los servicios usan repositorios sin conocer detalles de implementación

**Frameworks comunes que lo implementan:**
- Doctrine ORM (PHP)
- TypeORM (NodeJS) ← **Este proyecto**
- Hibernate ORM (Java)
- Entity Framework Core (.NET)

#### Adapter Pattern

**Qué hace**: Permite que dos clases incompatibles trabajen juntas envolviendo una en un "adaptador" que traduce su interfaz para que sea compatible con la otra.

**Ejemplo conceptual:**
- Tenés una clase que espera un `PaymentProcessor`, pero recibís un `LegacyPay`
- Creás un `LegacyPayAdapter` que implementa `PaymentProcessor` y traduce las llamadas

**Muy útil para integrar código nuevo con código viejo o de terceros, sin tener que modificar el código original.**

**En este proyecto:**
- Los DTOs actúan como adaptadores entre la capa de presentación y la capa de negocio
- Los Controllers adaptan las peticiones HTTP a llamadas de servicios
- Los Repositories adaptan las operaciones de dominio a operaciones de base de datos

### Patrones de Comportamiento (Behavioral)

#### Strategy Pattern

**Qué hace**: Permite cambiar el comportamiento de un algoritmo en tiempo de ejecución, eligiendo entre varias estrategias que comparten una interfaz común.

**Ejemplos:**
- `LoginStrategy` → `LocalLoginStrategy`, `CognitoLoginStrategy`
- `CompressorStrategy` → `ZipStrategy`, `RarStrategy`
- `PaymentStrategy` → `MercadoPagoStrategy`, `StripeStrategy`

**Ventajas:**
- Código abierto a extensión sin tener que modificarlo
- Fácil de probar cada estrategia por separado
- Reduce condicionales grandes (if/switch) con múltiples comportamientos posibles

**Ideal cuando:**
- Tenés varias formas de hacer algo y querés intercambiarlas fácilmente
- Querés evitar código duplicado y facilitar el mantenimiento

**En este proyecto:**
- Los Guards de autenticación podrían usar Strategy Pattern para diferentes métodos de autenticación
- Los servicios de pago podrían usar Strategy Pattern para diferentes proveedores de pago

### Por qué usar Patrones

- Fomentan código limpio, comprensible y mantenible
- Facilitan refactorizaciones y pruebas
- Reducen la complejidad
- Permiten hablar un lenguaje común entre desarrolladores (por ejemplo: "usemos un Strategy acá")
- Son bloques reutilizables que aceleran el desarrollo y evitan reinventar la rueda

---

## 🌿 Buenas Prácticas en Manejo de Ramas

Cuando varios desarrolladores trabajan sobre el mismo proyecto, es fundamental establecer estrategias claras de trabajo con ramas para evitar conflictos, asegurar la calidad y permitir entregas frecuentes.

### Trunk-Based Development (TBD)

**Qué es:**
- Todos trabajan sobre una rama principal (main o master) llamada trunk
- Las nuevas funcionalidades se crean en ramas muy cortas y de vida breve (horas o pocos días)
- Se integran al trunk varias veces al día
- Para evitar que código incompleto rompa el sistema, se usan feature flags (banderas para activar/desactivar partes nuevas)

**Ventajas:**
- Integra cambios rápidamente
- Minimiza conflictos entre ramas
- Aumenta la velocidad de entrega

**Desventajas:**
- Requiere buena disciplina y tests automatizados
- No apto para equipos sin CI/CD sólida

### Gitflow

**Qué es:**
Propone una estructura de ramas más rígida y planificada:
- **main** → rama estable con versiones en producción
- **develop** → rama de integración para desarrollo
- **feature/\*** → nuevas funcionalidades
- **release/\*** → preparan una nueva versión
- **hotfix/\*** → corrigen errores críticos en producción

**Ventajas:**
- Organización clara de versiones y etapas de desarrollo
- Ideal para proyectos con ciclos de release largos

**Desventajas:**
- Mucha burocracia de ramas
- Ralentiza la integración

### Code Review

**¿Qué es?** Es el proceso en el que un desarrollador revisa el código escrito por otro antes de integrarlo al repositorio principal. Normalmente se hace cuando alguien abre un Pull Request o Merge Request.

**¿Por qué es importante?**
- **Detectar errores**: Localiza bugs y vulnerabilidades antes de que lleguen a producción
- **Mejorar la calidad**: Asegura que se cumplan los estándares de estilo y buenas prácticas
- **Aprender juntos**: Fomenta el intercambio de conocimiento dentro del equipo

**Buenas prácticas:**
- Revisiones frecuentes y pequeñas (mejor que una gigante al final)
- Comentarios constructivos y específicos
- No solo buscar errores, también reconocer lo bien hecho
- Revisar tanto la funcionalidad como el diseño y la mantenibilidad

### Change Requests (Solicitudes de Cambio) y Filosofía Be Pragmatic

**¿Qué es?** Un Change Request es una propuesta formal de modificación del software existente: puede ser corregir un bug, mejorar una funcionalidad o añadir algo nuevo.

**¿Por qué son importantes?**
- **Mantener el software actualizado**: Evitan que el proyecto quede obsoleto
- **Mejorar la calidad**: Cada cambio es una oportunidad de refinar el código
- **Comunicación en equipo**: Todos saben qué cambios se van a introducir y por qué

**Filosofía "Be Pragmatic":**
- **Priorizar lo esencial**: No intentar hacerlo perfecto si con menos esfuerzo se logra lo necesario
- **Soluciones prácticas**: Escoger lo que funcione bien y rápido
- **Equilibrio**: Mantener el ritmo sin sacrificar calidad, pero sin sobre-ingeniería
- **Pragmatismo sobre perfección**: Es mejor tener algo funcionando que algo perfecto que nunca se termina

---

## 🔄 Integración Continua y Despliegue Continuo (CI/CD)

### Integración Continua (Continuous Integration — CI)

**Qué es**: La Integración Continua consiste en fusionar frecuentemente los cambios de código al repositorio principal, y ejecutar de forma automática una serie de pruebas y análisis para asegurar que todo sigue funcionando.

**CI asegura que el software siempre esté en un estado funcional, y evita que los errores se acumulen.**

**Flujo típico:**
1. El desarrollador hace commit y push de sus cambios
2. El sistema CI detecta los cambios
3. Se ejecutan automáticamente:
   - Tests unitarios
   - Tests de integración
   - Análisis estático de código (SAST)
   - Build del proyecto
4. Si todo pasa, los cambios se integran
5. Si algo falla, se notifica al desarrollador

### Análisis Estático (SAST)

**Objetivo**: Analizar el código sin ejecutarlo, buscando problemas potenciales.

**Herramientas comunes**: SonarQube, ESLint, Checkstyle, Prettier

**Etapas típicas:**
- **Estilo de código** (formato, nombres de variables, etc.)
- **Security Check** (vulnerabilidades comunes)
- **Complejidad** (código difícil de mantener)
- **Duplicación de código**
- **Dependencias inseguras o desactualizadas**
- **Errores potenciales**

**En este proyecto:**
- ESLint para análisis estático de código
- Prettier para formateo automático
- Configuración en `package.json` con scripts de lint

### Continuous Deployment (CD)

**Qué es**: Es la práctica de liberar automáticamente a entornos de producción todo el código que pasa las pruebas de Integración Continua. Es el paso siguiente a la CI: en lugar de solo integrar y probar, también se despliega automáticamente.

**Flujo típico de un Pipeline de CD:**

1. **Release** (empaquetar la nueva versión):
   - Herramientas comunes: Jenkins, GitHub Actions, Azure DevOps, GitLab CI
   - Build de la aplicación
   - Creación de artefactos (Docker images, paquetes, etc.)

2. **Deploy** (desplegar en el entorno objetivo):
   - Docker (contenedores)
   - ArqueCD (CD para Kubernetes)
   - AWS Lambda (serverless)
   - Heroku, Vercel, Netlify (plataformas PaaS)

3. **Operate** (operar y gestionar la infraestructura):
   - Kubernetes / ECS (orquestación de contenedores)
   - Terraform (infraestructura como código)
   - Ansible (automatización de servidores)

4. **Monitor** (vigilar el sistema en producción):
   - Grafana, Datadog, New Relic, Dynatrace (monitoreo de métricas y logs)
   - Sentry (monitoreo de errores)
   - Log aggregation (ELK Stack, CloudWatch)

**Objetivo**: Tener un flujo automatizado, rápido y confiable, donde cada cambio validado llega a los usuarios sin intervención manual.

### Beneficios de CI/CD

- **Detección temprana de errores**: Los problemas se detectan inmediatamente después del commit
- **Despliegues más frecuentes**: Permite entregar valor a los usuarios más rápido
- **Reducción de riesgos**: Los cambios pequeños son menos riesgosos que los grandes
- **Automatización**: Reduce el trabajo manual y los errores humanos
- **Feedback rápido**: Los desarrolladores reciben feedback inmediato sobre sus cambios
- **Mayor confianza**: El equipo confía más en el código que se despliega

---

## ✅ Buenas Prácticas

### 1. **Configuración y Variables de Entorno**

- **ConfigModule**: Uso de `@nestjs/config` para gestión de configuración
- **Variables de entorno**: Credenciales y configuraciones sensibles en `.env`
- **Configuración global**: `ConfigModule.forRoot({ isGlobal: true })`
- **Validación**: Type-safe access mediante `ConfigService`

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    // ...
  }),
  inject: [ConfigService],
})
```

### 2. **Validación de Datos**

- **class-validator**: Validación declarativa mediante decoradores
- **Validación en DTOs**: Validación automática en endpoints
- **Mensajes de error claros**: Excepciones descriptivas

```typescript
export class CreateAuthDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  contraseña: string;
}
```

### 3. **Manejo de Errores**

- **Excepciones HTTP**: Uso de excepciones de NestJS
  - `NotFoundException`: Recurso no encontrado
  - `BadRequestException`: Solicitud inválida
  - `UnauthorizedException`: No autenticado
- **Mensajes descriptivos**: Errores claros para el cliente
- **Validación de estados**: Validación de estados de pedidos antes de transiciones

### 4. **Seguridad**

- **Hashing de contraseñas**: Uso de `bcrypt` con salt rounds
- **JWT Tokens**: Tokens firmados y con expiración
- **CORS configurado**: Permite solo orígenes específicos
- **Guards de autenticación**: Protección de rutas sensibles
- **Role-based access**: Control de acceso basado en roles

### 5. **Base de Datos**

- **Migraciones**: Versionado del esquema de base de datos
- **Relaciones bien definidas**: OneToMany, ManyToOne, OneToOne
- **Cascade operations**: Operaciones en cascada cuando es apropiado
- **Soft deletes**: Uso de `onDelete: 'SET NULL'` para preservar integridad
- **Índices únicos**: Email único en usuarios
- **Timestamps**: `createdAt` y `updatedAt` automáticos

### 6. **Código Limpio (Clean Code)**

**Qué es**: Escribir código que otras personas puedan entender fácilmente, no solo que funcione.

**Principios clave:**
- **Usar nombres significativos** para variables, funciones y clases
- **Mantener un formato consistente**
- **Hacer funciones simples y cortas** (una sola responsabilidad)
- **Evitar comentarios innecesarios**: Si necesitas explicarlo con texto, probablemente el código no es claro
- **Usar early returns** para evitar anidaciones profundas
- **No usar números o strings mágicos**: Usar constantes con nombres claros
- **Aplicar principios como**:
  - **DRY (Don't Repeat Yourself)**: Evitar duplicación de código
  - **KISS (Keep It Simple, Stupid)**: No complicar lo simple
  - **Tell, Don't Ask**: Que los objetos hagan su trabajo, no exponer datos para que otros lo hagan
  - **DTOs (Data Transfer Objects)**: Clases para transportar datos sin lógica

**En este proyecto:**
- **Nombres descriptivos**: Variables y funciones con nombres claros
- **Comentarios útiles**: Comentarios en español para explicar lógica compleja
- **Estructura consistente**: Misma estructura en todos los módulos
- **TypeScript estricto**: Uso de tipos para mayor seguridad
- **Early returns**: Evitar anidaciones profundas
- **Constantes**: No usar números mágicos
- **DTOs**: Objetos de transferencia de datos sin lógica

### 7. **Refactoring**

**Qué es**: Refactorizar es reestructurar el código sin cambiar su comportamiento externo. No se agregan nuevas funcionalidades, solo se mejora el código existente para que sea más claro, limpio y fácil de mantener.

**Cuándo hacerlo:**
- Cuando ves código duplicado
- Cuando el código es difícil de entender
- Cuando un cambio pequeño rompe muchas cosas
- Cuando el código viola principios SOLID
- Cuando el código tiene alta complejidad ciclomática

**Beneficios:**
- Reduce la complejidad
- Facilita agregar nuevas funcionalidades
- Disminuye errores futuros
- Mejora la mantenibilidad
- Facilita el testing

**Cómo hacerlo:**
- Hacer pequeños cambios incrementales
- Ejecutar tests después de cada cambio
- Mantener el comportamiento externo igual
- Aplicar principios SOLID
- Extraer métodos/funciones cuando sea necesario
- Eliminar código duplicado

**En este proyecto:**
- El código está estructurado de manera que facilita el refactoring
- Los tests aseguran que el refactoring no rompa funcionalidad
- Los módulos están bien separados, facilitando cambios aislados

### 8. **Testing**

- **Tests unitarios**: Para cada servicio
- **Tests de integración**: Para flujos completos
- **Mocks reutilizables**: Utilidades de testing compartidas
- **Cobertura de código**: Medición de cobertura
- **Tests aislados**: Cada test es independiente

### 9. **Linting y Formateo**

- **ESLint**: Configuración con TypeScript ESLint
- **Prettier**: Formateo automático de código
- **Reglas personalizadas**: Reglas ajustadas al proyecto
- **Integración en scripts**: `npm run lint` y `npm run format`

### 10. **Documentación**

- **README.md**: Documentación del proyecto
- **Comentarios en código**: Explicaciones de lógica compleja
- **Tipos TypeScript**: Auto-documentación mediante tipos
- **Ejemplos en tests**: Tests como documentación de uso

### 11. **Gestión de Dependencias**

- **package.json**: Dependencias bien organizadas
- **Versionado**: Versiones específicas de dependencias
- **Scripts útiles**: Scripts para desarrollo, testing y producción
- **Separación dev/prod**: Dependencias de desarrollo separadas

### 12. **Estructura de Proyecto**

- **Organización por features**: Cada feature en su propio módulo
- **Separación de concerns**: Controllers, Services, Entities, DTOs separados
- **Carpetas de migraciones**: Migraciones organizadas en carpeta dedicada
- **Configuración centralizada**: Archivos de configuración en carpeta `config/`

### 13. **Performance**

- **Lazy loading**: Carga de relaciones bajo demanda
- **Índices de base de datos**: Para consultas frecuentes
- **Queries optimizadas**: Uso de `relations` solo cuando es necesario
- **Paginación**: Para listados grandes (implementable)

### 14. **Logging y Monitoreo**

- **Console.log estratégico**: Para debugging (mejorable con Logger de NestJS)
- **Manejo de errores**: Errores capturados y manejados apropiadamente

### 15. **API RESTful**

- **Rutas RESTful**: Estructura de URLs siguiendo convenciones REST
- **Métodos HTTP apropiados**: GET, POST, PATCH, DELETE según corresponda
- **Códigos de estado HTTP**: Uso correcto de códigos de respuesta
- **Recursos anidados**: Rutas como `/orders/:id/pay` para acciones específicas

---

## 📊 Resumen

Este proyecto demuestra una implementación profesional de un backend con NestJS, siguiendo:

### Arquitectura
- ✅ **Arquitectura por capas** bien definida (Presentación, Negocio, Datos, DTOs)
- ✅ **Arquitectura monolítica modular** con organización por features
- ✅ **Domain-Driven Design (DDD)** para modelar el negocio
- ✅ **Arquitectura Hexagonal** con puertos y adaptadores
- ✅ **Separación de responsabilidades** clara entre módulos
- ✅ **Inversión de dependencias** mediante inyección de dependencias

### Testing
- ✅ **Pirámide de Testing** implementada (Unit, Integration, E2E)
- ✅ **Tests unitarios** con mocks y stubs
- ✅ **Tests de integración** con base de datos en memoria
- ✅ **Tests E2E** para validar flujos completos
- ✅ **TDD** como metodología de desarrollo
- ✅ **Cobertura de código** medida y monitoreada

### Principios de Diseño
- ✅ **Principios SOLID** aplicados consistentemente
- ✅ **Acoplamiento bajo** y alta cohesión
- ✅ **DRY (Don't Repeat Yourself)** mediante reutilización
- ✅ **KISS (Keep It Simple, Stupid)** para simplicidad
- ✅ **Clean Code** con nombres descriptivos y código claro
- ✅ **Refactoring** continuo para mejorar la calidad

### Patrones de Diseño
- ✅ **Repository Pattern** para abstracción de datos
- ✅ **Adapter Pattern** para integración de componentes
- ✅ **Strategy Pattern** aplicable para extensibilidad
- ✅ **DTO Pattern** para transferencia de datos
- ✅ **Factory Pattern** para creación de objetos

### Buenas Prácticas
- ✅ **Manejo de ramas** con estrategias claras (TBD, Gitflow)
- ✅ **Code Review** para asegurar calidad
- ✅ **Change Requests** con filosofía "Be Pragmatic"
- ✅ **CI/CD** para integración y despliegue continuo
- ✅ **Análisis estático** de código (SAST) con ESLint
- ✅ **Configuración** mediante variables de entorno
- ✅ **Validación de datos** con class-validator
- ✅ **Manejo de errores** con excepciones HTTP apropiadas
- ✅ **Seguridad** con JWT, bcrypt, y RBAC
- ✅ **Base de datos** con migraciones y relaciones bien definidas
- ✅ **API RESTful** siguiendo convenciones estándar

### Gestión y Operaciones
- ✅ **Documentación** completa del proyecto
- ✅ **Linting y formateo** automatizado
- ✅ **Gestión de dependencias** organizada
- ✅ **Estructura de proyecto** clara y consistente
- ✅ **Performance** optimizada con lazy loading e índices
- ✅ **Logging y monitoreo** para observabilidad

### Escalabilidad y Evolución
- ✅ **Modularidad** que facilita el crecimiento
- ✅ **Contextos delimitados** preparados para microservicios futuros
- ✅ **Desacoplamiento** que permite cambios independientes
- ✅ **Testabilidad** que facilita refactorizaciones
- ✅ **Mantenibilidad** mediante código limpio y bien estructurado

El proyecto está bien estructurado para crecer y mantenerse, con una base sólida que facilita la adición de nuevas funcionalidades y la corrección de errores. Sigue las mejores prácticas de la industria y está preparado para evolucionar desde un monolito modular a una arquitectura de microservicios si es necesario en el futuro.


